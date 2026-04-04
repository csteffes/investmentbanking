"use client";

import { useCallback, useRef, useState } from "react";
import type {
  InterviewProfile,
  PracticeDebrief,
  PracticeDebriefRequest,
} from "@/lib/api-types";

export type SessionState =
  | "idle"
  | "connecting"
  | "connected"
  | "ending"
  | "debriefing"
  | "done"
  | "error";

export type TranscriptEntry = {
  id: string;
  speaker: "interviewer" | "candidate";
  text: string;
};

type UseVoiceSessionReturn = {
  state: SessionState;
  transcript: TranscriptEntry[];
  debrief: PracticeDebrief | null;
  error: string | null;
  start: (profile: InterviewProfile) => Promise<void>;
  stop: () => Promise<void>;
};

async function readApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  return payload?.error || response.statusText || "Request failed.";
}

export function useVoiceSession(): UseVoiceSessionReturn {
  const [state, setState] = useState<SessionState>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [debrief, setDebrief] = useState<PracticeDebrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // Accumulate full plain-text transcript for the debrief call
  const transcriptTextRef = useRef<string>("");
  // Track partial AI response being assembled
  const currentAiTextRef = useRef<string>("");
  const profileRef = useRef<InterviewProfile | null>(null);

  const cleanup = useCallback(() => {
    dcRef.current?.close();
    pcRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
  }, []);

  const stop = useCallback(async () => {
    if (state === "idle" || state === "debriefing" || state === "done") return;

    setState("ending");
    const fullTranscript = transcriptTextRef.current;
    cleanup();

    if (!fullTranscript.trim()) {
      setState("idle");
      return;
    }

    setState("debriefing");
    try {
      const debriefPayload: PracticeDebriefRequest = {
        ...(profileRef.current ?? {}),
        transcript: fullTranscript,
      };
      const res = await fetch("/api/session/debrief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(debriefPayload),
      });
      if (!res.ok) throw new Error(await readApiError(res));
      const data = (await res.json()) as PracticeDebrief;
      setDebrief(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create coach notes.");
      setState("error");
    }
  }, [state, cleanup]);

  const start = useCallback(
    async (profile: InterviewProfile) => {
      setError(null);
      setTranscript([]);
      setDebrief(null);
      transcriptTextRef.current = "";
      currentAiTextRef.current = "";
      profileRef.current = profile;
      setState("connecting");

      try {
        // 1. Get ephemeral token from our API
        const tokenRes = await fetch("/api/realtime/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        if (!tokenRes.ok) throw new Error(await readApiError(tokenRes));
        const tokenData = (await tokenRes.json()) as {
          client_secret?: { value?: string };
        };
        const ephemeralKey = tokenData?.client_secret?.value;
        if (!ephemeralKey) throw new Error("No ephemeral key returned.");

        // 2. Get microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // 3. Set up RTCPeerConnection
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        // Receive remote audio
        const audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        pc.ontrack = (e) => {
          audioEl.srcObject = e.streams[0] ?? null;
        };

        // Add local mic track
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        // 4. Data channel for events
        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onmessage = (e: MessageEvent<string>) => {
          try {
            const event = JSON.parse(e.data) as Record<string, unknown>;
            const type = event.type as string;

            // User speech transcript (final)
            if (type === "conversation.item.input_audio_transcription.completed") {
              const text = (event.transcript as string | undefined) ?? "";
              if (text.trim()) {
                const entry: TranscriptEntry = {
                  id: `user-${Date.now()}`,
                  speaker: "candidate",
                  text: text.trim(),
                };
                setTranscript((prev) => [...prev, entry]);
                transcriptTextRef.current += `\nCandidate: ${text.trim()}`;
              }
            }

            // AI response transcript — accumulate deltas
            if (type === "response.audio_transcript.delta") {
              const delta = (event.delta as string | undefined) ?? "";
              currentAiTextRef.current += delta;
            }

            // AI response transcript — finalized
            if (type === "response.audio_transcript.done") {
              const text = currentAiTextRef.current.trim();
              currentAiTextRef.current = "";
              if (text) {
                const entry: TranscriptEntry = {
                  id: `interviewer-${Date.now()}`,
                  speaker: "interviewer",
                  text,
                };
                setTranscript((prev) => [...prev, entry]);
                transcriptTextRef.current += `\nInterviewer: ${text}`;
              }
            }
          } catch {
            // Non-JSON or unknown event — ignore
          }
        };

        dc.onopen = () => {
          setState("connected");
        };

        dc.onerror = () => {
          setError("Connection error. Please try again.");
          setState("error");
          cleanup();
        };

        // 5. SDP exchange with OpenAI
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(
          `https://api.openai.com/v1/realtime?model=gpt-realtime-mini`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ephemeralKey}`,
              "Content-Type": "application/sdp",
            },
            body: offer.sdp,
          }
        );

        if (!sdpRes.ok) {
          const errText = await sdpRes.text();
          throw new Error(`OpenAI SDP error: ${errText}`);
        }

        const answerSdp = await sdpRes.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      } catch (err) {
        cleanup();
        setError(err instanceof Error ? err.message : "Failed to start session.");
        setState("error");
      }
    },
    [cleanup]
  );

  return { state, transcript, debrief, error, start, stop };
}
