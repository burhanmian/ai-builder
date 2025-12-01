"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectFile } from "@/types";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-muted/30">
      <div className="text-muted-foreground">Loading editor...</div>
    </div>
  ),
});

interface CodeEditorPaneProps {
  files: ProjectFile[];
  activeFile: string | null;
  openTabs: string[];
  onFileSelect: (path: string) => void;
  onTabClose: (path: string) => void;
  onFileChange: (path: string, content: string) => void;
}

function getLanguage(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const languageMap: Record<string, string> = {
    tsx: "typescript",
    ts: "typescript",
    jsx: "javascript",
    js: "javascript",
    css: "css",
    html: "html",
    json: "json",
    dart: "dart",
    md: "markdown",
  };
  return languageMap[ext || ""] || "plaintext";
}

export function CodeEditorPane({
  files,
  activeFile,
  openTabs,
  onFileSelect,
  onTabClose,
  onFileChange,
}: CodeEditorPaneProps) {
  const activeFileData = files.find((f) => f.path === activeFile);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        onFileChange(activeFile, value);
      }
    },
    [activeFile, onFileChange]
  );

  if (!activeFile || !activeFileData) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <p className="text-muted-foreground">Select a file to edit</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center border-b bg-muted/30 overflow-x-auto">
        {openTabs.map((tabPath) => {
          const tabFile = files.find((f) => f.path === tabPath);
          if (!tabFile) return null;
          const fileName = tabPath.split("/").pop();

          return (
            <div
              key={tabPath}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border-r cursor-pointer min-w-max",
                activeFile === tabPath
                  ? "bg-background"
                  : "bg-muted/50 hover:bg-muted"
              )}
              onClick={() => onFileSelect(tabPath)}
            >
              <span className="text-sm">{fileName}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-sm hover:bg-muted-foreground/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tabPath);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          value={activeFileData.content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
