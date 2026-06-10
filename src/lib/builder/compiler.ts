import React from "react";
import { PageRenderer } from "@/components/builder/PageRenderer";
import type { PageSpec } from "@/lib/types/page-spec";

/**
 * Compiles a V2 PageSpec into a fully rendered, self-contained static HTML page.
 * Uses React Server-Side Rendering to render the component tree, and links Tailwind CSS
 * and Google Fonts for beautiful presentation.
 */
export async function compilePageSpecToHtml(spec: PageSpec): Promise<string> {
  const { default: ReactDOMServer } = await import("react-dom/server");

  // Render components tree to HTML string
  const bodyHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(PageRenderer, { spec })
  );

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastApp V2 Page</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              200: '#c7d2fe',
              300: '#a5b4fc',
              400: '#818cf8',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              800: '#3730a3',
              900: '#312e81',
              950: '#1e1b4b',
            }
          }
        }
      }
    }
  </script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-50 min-h-screen">
  ${bodyHtml}
</body>
</html>`;
}
