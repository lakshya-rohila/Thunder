export function sanitizeComponent(component: any) {
  if (!component) return component;

  const dangerousKeywords = [
    "window.location",
    "document.cookie",
    "localStorage",
    "sessionStorage",
    "indexedDB",
    "fetch(",
    "XMLHttpRequest",
    "eval(",
    "new Function(",
    "document.write",
    "alert(",
    "prompt(",
    "confirm(",
  ];

  let js = component.js || "";

  // Simple keyword removal (MVP level)
  dangerousKeywords.forEach((keyword) => {
    // Regex to replace keyword with a safe comment, strictly globally
    // Escaping special regex characters like ( and .
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedKeyword, "gi");
    js = js.replace(regex, `/* Security blocked: ${keyword} */`);
  });

  // Prevent infinite loops (basic check)
  // This is hard to do perfectly with regex, but we can block obvious patterns or limit execution time in the iframe runner instead.
  // For now, let's just update the JS.

  return {
    ...component,
    js,
  };
}
