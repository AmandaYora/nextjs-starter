const DEFAULT_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(input: Date | string) {
  const date = typeof input === "string" ? new Date(input) : input;
  return DEFAULT_FORMAT.format(date);
}
