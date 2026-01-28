type LogMetadata = Record<string, unknown> | undefined;

type LogLevel = "info" | "warn" | "error";

const REDACT_KEYS = ["password", "passwordhash", "token", "authorization", "secret", "encryptionkey"];

function redactValue(key: string, value: unknown): unknown {
  if (REDACT_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
    return "***redacted***";
  }
  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === "object" && item !== null ? redactObject(item as Record<string, unknown>) : item));
  }
  if (typeof value === "object" && value !== null) {
    return redactObject(value as Record<string, unknown>);
  }
  return value;
}

function redactObject(meta: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(meta).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key] = redactValue(key, value);
    return acc;
  }, {});
}

function serialize(level: LogLevel, message: string, meta?: LogMetadata) {
  const payload: Record<string, unknown> = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (meta) {
    payload.meta = redactObject(meta);
  }

  return JSON.stringify(payload);
}

function emit(level: LogLevel, message: string, meta?: LogMetadata) {
  const serialized = serialize(level, message, meta);
  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

export const logger = {
  info(message: string, meta?: LogMetadata) {
    emit("info", message, meta);
  },
  warn(message: string, meta?: LogMetadata) {
    emit("warn", message, meta);
  },
  error(message: string, meta?: LogMetadata) {
    emit("error", message, meta);
  },
};
