/**
 * Converts a raw file name, storage key, or URL into a clean, human-readable file name.
 * - Multi-pass safely decodes percent-encoded entities (%20 -> space, etc.)
 * - Strips URL query parameters and hash anchors
 * - Strips system timestamps, UUIDs, and storage prefixes
 *
 * @param {string|File|Blob|Object} fileOrUrl - The file object, URL, or filename string.
 * @param {string} [fallback=""] - Fallback if no valid name can be determined.
 * @returns {string} The cleaned, human-readable file name.
 */
export const formatHumanReadableFileName = (fileOrUrl, fallback = "") => {
  if (!fileOrUrl) return fallback;

  let rawName =
    typeof fileOrUrl === "object" && fileOrUrl !== null && fileOrUrl.name
      ? fileOrUrl.name
      : typeof fileOrUrl === "object" && fileOrUrl !== null && fileOrUrl.originalFileName
      ? fileOrUrl.originalFileName
      : typeof fileOrUrl === "object" && fileOrUrl !== null && fileOrUrl.storedFileName
      ? fileOrUrl.storedFileName
      : String(fileOrUrl);

  if (!rawName || typeof rawName !== "string") return fallback;

  // Remove query parameters or hash anchors
  const withoutQuery = rawName.split("?")[0].split("#")[0];

  // Extract base filename from Unix or Windows path
  const baseName = withoutQuery.split("/").pop().split("\\").pop();

  // Multi-pass URL decode
  let decoded = baseName;
  try {
    decoded = decodeURIComponent(decodeURIComponent(baseName));
  } catch {
    try {
      decoded = decodeURIComponent(baseName);
    } catch {
      decoded = baseName;
    }
  }

  // Strip system prefixes (timestamps, hex strings, UUIDs)
  const cleanName = decoded
    .replace(/^\d{10,14}[-_][a-zA-Z0-9]{8,16}[-_]/i, "")
    .replace(/^\d{10,14}[-_]/i, "")
    .replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[-_]/i, "");

  const result = cleanName && cleanName.trim() ? cleanName.trim() : decoded;
  return result || fallback;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
