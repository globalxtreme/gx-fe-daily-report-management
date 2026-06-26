import SlackMarkdown from "slack-markdown";
import DOMPurify from "dompurify";

/**
 * Format date string to "Tue, 29 Apr 2026, 09:15"
 */
export function formatDateTime(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


export function formatDateTimeSlash(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  return date
    .toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
}

export function formatDateSlash(dateStr: string): string {
  const [day, month, year] = dateStr.split("/").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format "YYYY-MM-DD" to "Tuesday, 29 April 2026"
 */
export function formatDateLong(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format "YYYY-MM-DD" to "29 Apr 2026"
 */
export function formatDateShort(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time portion of an date string to "09:15"
 */
export function formatTime(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute, second);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/**
 * Get initials from a full name (up to 2 chars)
 */
export function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Today's date as "YYYY-MM-DD"
 */
export function todayString(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/**
 * N days ago as "YYYY-MM-DD"
 */
export function daysAgoString(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * Truncate text to maxLen chars, appending "…"
 */
export function truncate(text: string, maxLen: number): string {
  if (!text) return "";
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.length <= maxLen) return firstLine;
  return firstLine.slice(0, maxLen) + "…";
}

/**
 * Truncate text to maxLen chars, appending "…"
 */
export function truncateSlack(text: string, maxLen: number): string {
  if (!text) return "";
  const firstLine = text.split("\n")[0].trim();
  if (firstLine.length <= maxLen) return firstLine;

  const finalCut = firstLine.slice(0, maxLen) + "…";

  const parseAnswer = SlackMarkdown.toHTML(finalCut);
  return  DOMPurify.sanitize(parseAnswer);
}

/**
 * Returns true if blocker value should be treated as empty
 */
export function isEmptyBlocker(value: string): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "-" || trimmed.toLowerCase() === "none";
}
