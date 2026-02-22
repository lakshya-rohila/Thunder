# Thunder ⚡

Thunder is an advanced AI-powered frontend development platform designed to generate high-quality, production-ready UI components and applications instantly. It leverages the power of Google's Gemini models to understand natural language prompts and output clean, modern code.

## 🚀 Core Features

### 1. Intelligent Code Generation
*   **Multi-Framework Support**: Generates code for:
    *   **HTML / CSS / Vanilla JS**: Standard, framework-free implementation.
    *   **React (JSX)**: Modern functional components with hooks support.
*   **Styling Modes**:
    *   **Tailwind CSS**: Utility-first styling (default).
    *   **Vanilla CSS**: Scoped, custom CSS.
*   **Project Types**:
    *   **UI Components**: Buttons, cards, navbars, etc.
    *   **Interactive Apps**: Games, tools, calculators (Snake, Tetris, etc.).
    *   **Refinement**: "Fix it" mode to iterate on existing code.

### 2. Robust AI Engine
*   **Model Fallback System**: Automatically handles API rate limits (429) and model unavailability (404) by cycling through a prioritized list of models:
    1.  `gemini-2.5-flash` (Latest, fastest)
    2.  `gemini-2.5-flash-lite`
    3.  `gemini-2.0-flash`
    4.  `gemini-2.0-flash-lite`
*   **Context Awareness**: Understands previous code context for iterative improvements.
*   **Smart Validation**: Ensures generated output is valid JSON and contains necessary fields (HTML/JS/CSS or JSX).

### 3. Interactive Workspace
*   **Live Preview Panel**:
    *   Real-time rendering of generated code.
    *   **React Runtime**: In-browser compilation of JSX using Babel Standalone.
    *   **Smart Component Detection**: Automatically identifies and mounts the main component (e.g., `ProductCard`, `App`) without requiring strict naming conventions.
    *   **Console Proxy**: Captures logs and errors from the preview iframe and displays them in the UI for debugging.
*   **Code Editor**: Monaco Editor integration with syntax highlighting for HTML, CSS, JS, and JSX.
*   **File Explorer**: Dynamic file tree that adapts to the selected framework (shows `App.jsx` for React, `index.html` for standard).

---

## 🏗 Architecture

### Backend (`/app/api`)
*   **Routes**:
    *   `/generate`: Main endpoint for AI code generation. Handles prompt construction, model selection, and fallback logic.
    *   `/chat/create`: Saves generated components to the database (MongoDB).
*   **Libraries (`/lib`)**:
    *   `llm.ts`: Core interface with Google Gemini API. Implements the `generateWithFallback` strategy.
    *   `validator.ts`: Validates AI responses. Recently updated to support "JSX-only" responses (allowing empty HTML).
    *   `promptTemplate.ts`: System prompts defining the AI's persona and constraints. Updated to explicitly allow React generation.

### Frontend (`/modules`, `/components`)
*   **State Management (Redux)**:
    *   `ChatSlice.ts`: Manages application state, including the new `jsx` field for React components.
*   **Components**:
    *   `PreviewPanel.tsx`: The heart of the visual experience. Handles safe iframe rendering, message passing for console logs, and the React mounting logic.
    *   `CodeTabs.tsx`: Manages the code view, switching tabs based on available content.

---

## 🛠 Recent Improvements (Change Log)

### 1. React / JSX Support
*   **Feature**: Enabled generation of single-file React components.
*   **Implementation**:
    *   Updated `promptTemplate.ts` to remove "No frameworks" restriction.
    *   Updated `llm.ts` to enforce specific JSON structure for React requests (empty HTML/JS, populated JSX).
    *   Updated `validator.ts` to pass validation if `jsx` is present, even if `html` is empty.

### 2. Robustness & Stability
*   **Model Fallback**: Implemented a retry mechanism in `lib/llm.ts` to handle Google API quotas and 404s seamlessly.
*   **Error Handling**: Enhanced `PreviewPanel` to catch and display runtime errors (e.g., "React is not defined") directly in the preview window.

### 3. UI/UX Enhancements
*   **Alignment Fix**: Switched `PreviewPanel` layout to `display: grid; place-items: center` with padding to ensure components are always centered and never cut off.
*   **Smart Mounting**: The previewer now intelligently regex-matches the component name in the JSX string to mount it, solving the "Could not find component 'App'" error.

---

## 🔮 Future Roadmap
*   **Multi-file Projects**: Support for complex apps with multiple components.
*   **Export Options**: Download as ZIP or deploy to Vercel/Netlify.
*   **Theme Customization**: Global theme settings for generated components.
