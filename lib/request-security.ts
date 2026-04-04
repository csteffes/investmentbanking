import { NextResponse } from "next/server";

import { env } from "@/lib/env";

type GuardFailure = {
  response: NextResponse;
};

type BrowserPostGuardOptions = {
  requireJson?: boolean;
};

function jsonError(status: number, error: string) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function readAllowedHosts(request: Request) {
  const hosts = new Set<string>();
  const requestHost = request.headers.get("host");
  const origin = request.headers.get("origin");
  const vercelUrl = process.env.VERCEL_URL;

  if (requestHost) {
    hosts.add(requestHost.toLowerCase());
  }

  if (origin) {
    try {
      hosts.add(new URL(origin).host.toLowerCase());
    } catch {
      // handled separately
    }
  }

  if (env.siteUrl) {
    hosts.add(new URL(env.siteUrl).host.toLowerCase());
  }

  if (vercelUrl) {
    hosts.add(vercelUrl.toLowerCase());
  }

  return hosts;
}

export function guardBrowserPostRequest(
  request: Request,
  options: BrowserPostGuardOptions = {}
): GuardFailure | null {
  const requireJson = options.requireJson ?? true;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (requireJson) {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return {
        response: jsonError(415, "Requests to this endpoint must use application/json."),
      };
    }
  }

  if (!origin || !host) {
    return {
      response: jsonError(403, "Missing request origin."),
    };
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return {
      response: jsonError(403, "Invalid request origin."),
    };
  }

  const allowedHosts = readAllowedHosts(request);
  if (!allowedHosts.has(parsedOrigin.host.toLowerCase()) || !allowedHosts.has(host.toLowerCase())) {
    return {
      response: jsonError(403, "Cross-site requests are not allowed."),
    };
  }

  const isLocalhost = parsedOrigin.hostname === "localhost" || parsedOrigin.hostname === "127.0.0.1";
  if (!isLocalhost && parsedOrigin.protocol !== "https:") {
    return {
      response: jsonError(403, "Insecure request origin."),
    };
  }

  return null;
}
