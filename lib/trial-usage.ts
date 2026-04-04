import { createHash } from "node:crypto";

import { getAdminSupabase } from "@/lib/supabase";

type UsageKind = "realtime" | "debrief";

type TrialCounterRow = {
  trial_id: string;
  realtime_count: number;
  debrief_count: number;
  last_ip: string | null;
};

type SourceCounterRow = {
  source_key: string;
  bucket_date: string;
  realtime_count: number;
  debrief_count: number;
};

function createSourceKey(ipAddress: string | null, userAgent: string | null) {
  return createHash("sha256")
    .update(`${ipAddress ?? "unknown"}::${userAgent ?? "unknown"}`)
    .digest("hex");
}

export async function consumeAnonymousSourceUsage(
  kind: UsageKind,
  limit: number,
  ipAddress: string | null,
  userAgent: string | null
) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    throw new Error("Supabase admin client is required for anonymous source tracking.");
  }

  const bucketDate = new Date().toISOString().slice(0, 10);
  const sourceKey = createSourceKey(ipAddress, userAgent);

  const { data: existing, error: selectError } = await supabase
    .from("anonymous_source_limits")
    .select("source_key, bucket_date, realtime_count, debrief_count")
    .eq("source_key", sourceKey)
    .eq("bucket_date", bucketDate)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  const current = (existing as SourceCounterRow | null) ?? {
    source_key: sourceKey,
    bucket_date: bucketDate,
    realtime_count: 0,
    debrief_count: 0,
  };

  const totalCount = current.realtime_count + current.debrief_count;
  if (totalCount >= limit) {
    return {
      allowed: false as const,
    };
  }

  const nextRealtime = kind === "realtime" ? current.realtime_count + 1 : current.realtime_count;
  const nextDebrief = kind === "debrief" ? current.debrief_count + 1 : current.debrief_count;

  const { error: upsertError } = await supabase.from("anonymous_source_limits").upsert(
    {
      source_key: sourceKey,
      bucket_date: bucketDate,
      realtime_count: nextRealtime,
      debrief_count: nextDebrief,
    },
    { onConflict: "source_key,bucket_date" }
  );

  if (upsertError) {
    throw upsertError;
  }

  return {
    allowed: true as const,
  };
}

export async function consumeTrialUsage(
  trialId: string,
  kind: UsageKind,
  limit: number,
  ipAddress: string | null
) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    throw new Error("Supabase admin client is required for trial usage tracking.");
  }

  const { data: existing, error: selectError } = await supabase
    .from("trial_usage_counters")
    .select("trial_id, realtime_count, debrief_count, last_ip")
    .eq("trial_id", trialId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  const current = (existing as TrialCounterRow | null) ?? {
    trial_id: trialId,
    realtime_count: 0,
    debrief_count: 0,
    last_ip: null,
  };

  const currentCount = kind === "realtime" ? current.realtime_count : current.debrief_count;
  if (currentCount >= limit) {
    return {
      allowed: false as const,
      remaining: 0,
    };
  }

  const nextRealtime = kind === "realtime" ? current.realtime_count + 1 : current.realtime_count;
  const nextDebrief = kind === "debrief" ? current.debrief_count + 1 : current.debrief_count;

  const { error: upsertError } = await supabase.from("trial_usage_counters").upsert(
    {
      trial_id: trialId,
      realtime_count: nextRealtime,
      debrief_count: nextDebrief,
      last_ip: ipAddress,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "trial_id" }
  );

  if (upsertError) {
    throw upsertError;
  }

  const nextCount = kind === "realtime" ? nextRealtime : nextDebrief;
  return {
    allowed: true as const,
    remaining: Math.max(0, limit - nextCount),
  };
}
