export interface GeneratedComponent {
  name: string;
  html: string;
  css: string;
  js: string;
}

export function validateComponent(component: any): {
  isValid: boolean;
  error?: string;
} {
  if (!component || typeof component !== "object") {
    return { isValid: false, error: "Invalid JSON response" };
  }

  if (!component.html || typeof component.html !== "string") {
    return { isValid: false, error: "Missing HTML content" };
  }

  if (!component.css || typeof component.css !== "string") {
    return { isValid: false, error: "Missing CSS content" };
  }

  if (component.js && typeof component.js !== "string") {
    return { isValid: false, error: "Invalid JS content" };
  }

  const forbiddenTags = [
    "<html>",
    "<head>",
    "<body>",
    "<script src=",
    "import ",
    "require(",
  ];
  const lowerHtml = component.html.toLowerCase();

  for (const tag of forbiddenTags) {
    if (lowerHtml.includes(tag)) {
      return {
        isValid: false,
        error: `Forbidden tag or keyword found: ${tag}`,
      };
    }
  }

  return { isValid: true };
}
