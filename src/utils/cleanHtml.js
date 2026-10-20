/**
 * Utility to decode and normalize HTML entities in CMS descriptions.
 * Fixes content where raw HTML tags were pasted as text or entity-encoded (&lt;h1&gt;, &lt;p&gt;).
 */
export const cleanHtmlContent = (rawHtml) => {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  let cleaned = rawHtml.trim();

  // Check if content contains entity-escaped HTML tags (e.g. &lt;p&gt;, &lt;h1&gt;, etc.)
  const escapedTagRegex = /&lt;\/?(h[1-6]|p|div|ul|ol|li|span|strong|em|b|i|u|a|table|tr|td|th|tbody|thead|br|hr)\b/i;

  let iterations = 0;
  while (escapedTagRegex.test(cleaned) && iterations < 3) {
    cleaned = cleaned
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");
    iterations++;
  }

  // Remove invalid/redundant wrapper <p> tags around block-level elements
  cleaned = cleaned
    .replace(/<p>\s*<(h[1-6]|div|ul|ol|table)/gi, "<$1")
    .replace(/<\/(h[1-6]|div|ul|ol|table)>\s*<\/p>/gi, "</$1>")
    .replace(/<p>\s*<p>/gi, "<p>")
    .replace(/<\/p>\s*<\/p>/gi, "</p>");

  return cleaned;
};
