type EventLevel = "info" | "warn" | "error";

type ObservabilityEvent = {
  category: string;
  message: string;
  details?: Record<string, unknown>;
};

function write(level: EventLevel, event: ObservabilityEvent) {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    ...event,
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export function logSecurityEvent(message: string, details?: Record<string, unknown>) {
  write("warn", { category: "security", message, details });
}

export function logBillingEvent(message: string, details?: Record<string, unknown>) {
  write("info", { category: "billing", message, details });
}

export function logAiEvent(message: string, details?: Record<string, unknown>) {
  write("info", { category: "ai", message, details });
}

export function logServerError(message: string, details?: Record<string, unknown>) {
  write("error", { category: "server", message, details });
}
