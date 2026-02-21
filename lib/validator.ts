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

  // CSS is optional for Tailwind mode
  if (component.css === undefined || component.css === null) {
    component.css = ""; // Normalize to empty string if missing
  }

  if (typeof component.css !== "string") {
    return { isValid: false, error: "Invalid CSS content" };
  }

  if (component.js && typeof component.js !== "string") {
    return { isValid: false, error: "Invalid JS content" };
  }

  const forbiddenTags = [
    // "<html>",  <-- We allow <html> now for full app mode
    // "<head>",  <-- We allow <head> now for full app mode
    // "<body>",  <-- We allow <body> now for full app mode
    // "<script src=", <-- We allow <script src> now for external libraries (charts, p5.js, etc.)
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
