"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { ProjectFile, Viewport } from "@/types";

interface LivePreviewProps {
  files: ProjectFile[];
  viewport: Viewport;
}

const viewportSizes: Record<Viewport, { width: string; label: string }> = {
  desktop: { width: "100%", label: "Desktop" },
  tablet: { width: "768px", label: "Tablet (768px)" },
  mobile: { width: "375px", label: "Mobile (375px)" },
};

export function LivePreview({ files, viewport }: LivePreviewProps) {
  const previewHtml = useMemo(() => {
    // Find main entry file
    const entryFile = files.find(
      (f) =>
        f.path.includes("App.tsx") ||
        f.path.includes("page.tsx") ||
        f.path.includes("index.tsx")
    );

    // Find CSS files
    const cssFiles = files.filter(
      (f) => f.path.endsWith(".css")
    );

    const cssContent = cssFiles.map((f) => f.content).join("\n");

    if (!entryFile) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
              background: #1a1a1a;
              color: #888;
            }
          </style>
        </head>
        <body>
          <p>No preview available</p>
        </body>
        </html>
      `;
    }

    // For React/Next.js, we'll create a simple HTML preview
    // In a real app, this would use a sandboxed iframe with proper React rendering
    const content = entryFile.content;

    // Extract JSX content (simplified for demo)
    const jsxMatch = content.match(/return\s*\(([\s\S]*?)\);/);
    const jsxContent = jsxMatch ? jsxMatch[1] : "<p>Unable to parse JSX</p>";

    // Convert className to class for HTML
    const htmlContent = jsxContent
      .replace(/className=/g, "class=")
      .replace(/\{`([^`]*)`\}/g, "$1")
      .replace(/\{[^}]+\}/g, "") // Remove JS expressions
      .replace(/<([A-Z][a-zA-Z]*)/g, "<div") // Convert components to divs
      .replace(/<\/([A-Z][a-zA-Z]*)/g, "</div");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${cssContent}
        </style>
      </head>
      <body class="min-h-screen bg-gray-50">
        ${htmlContent}
      </body>
      </html>
    `;
  }, [files]);

  const { width, label } = viewportSizes[viewport];

  return (
    <div className="h-full flex flex-col items-center justify-start p-4 bg-muted/30 overflow-auto">
      <div className="text-sm text-muted-foreground mb-4">{label}</div>
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
          viewport !== "desktop" && "mx-auto"
        )}
        style={{ width, minHeight: "400px" }}
      >
        <iframe
          srcDoc={previewHtml}
          className="w-full h-full min-h-[600px] border-0"
          sandbox="allow-scripts"
          title="Preview"
        />
      </div>
    </div>
  );
}
