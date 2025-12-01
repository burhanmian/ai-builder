"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code2,
  MessageSquare,
  Eye,
  Download,
  ChevronLeft,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { FileTree } from "@/components/file-tree";
import { CodeEditorPane } from "@/components/code-editor-pane";
import { AIChatPanel } from "@/components/ai-chat-panel";
import { LivePreview } from "@/components/live-preview";
import { FigmaImportDialog } from "@/components/figma-import-dialog";
import { exportProjectAsZip } from "@/lib/export";
import type { ProjectFile } from "@/types";
import type { Viewport } from "@/types";

interface ProjectEditorProps {
  project: {
    id: string;
    name: string;
    type: string;
    framework: string;
    files: unknown;
    messages: Array<{
      id: string;
      role: string;
      content: string;
      model?: string | null;
      createdAt: Date;
    }>;
  };
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const [files, setFiles] = useState<ProjectFile[]>(
    (project.files as ProjectFile[]) || []
  );
  const [activeFile, setActiveFile] = useState<string | null>(
    files.length > 0 ? files[0].path : null
  );
  const [openTabs, setOpenTabs] = useState<string[]>(
    files.length > 0 ? [files[0].path] : []
  );
  const [aiModel, setAiModel] = useState("gpt-4");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [messages, setMessages] = useState(project.messages);

  const handleFileSelect = useCallback((path: string) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  }, [openTabs]);

  const handleTabClose = useCallback((path: string) => {
    setOpenTabs((prev) => prev.filter((p) => p !== path));
    if (activeFile === path) {
      const remaining = openTabs.filter((p) => p !== path);
      setActiveFile(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
  }, [activeFile, openTabs]);

  const handleFileChange = useCallback((path: string, content: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.path === path ? { ...file, content } : file
      )
    );
  }, []);

  const handleAddFile = useCallback((path: string, content: string, language: string) => {
    const newFile: ProjectFile = { path, content, language };
    setFiles((prev) => [...prev, newFile]);
    setOpenTabs((prev) => [...prev, path]);
    setActiveFile(path);
  }, []);

  const handleExport = async () => {
    await exportProjectAsZip(project.name, files);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{project.name}</h1>
              <p className="text-xs text-muted-foreground capitalize">
                {project.framework} • {project.type}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* AI Model Selector */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                <SelectItem value="claude-3">Claude 3</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FigmaImportDialog
            framework={project.framework}
            onImport={(code) => handleAddFile("src/components/FigmaComponent.tsx", code, "typescript")}
          />

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export ZIP
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - File Tree */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <div className="p-3 border-b">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Files
            </h2>
          </div>
          <FileTree
            files={files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Center - Editor and Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <div className="border-b px-4 flex items-center justify-between">
              <TabsList className="h-12 bg-transparent border-0">
                <TabsTrigger value="code" className="gap-2 data-[state=active]:bg-muted">
                  <Code2 className="w-4 h-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-muted">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              {/* Viewport Selector (for preview) */}
              <div className="flex items-center gap-1">
                <Button
                  variant={viewport === "desktop" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewport("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewport === "tablet" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewport("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewport === "mobile" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewport("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
              <CodeEditorPane
                files={files}
                activeFile={activeFile}
                openTabs={openTabs}
                onFileSelect={handleFileSelect}
                onTabClose={handleTabClose}
                onFileChange={handleFileChange}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
              <LivePreview
                files={files}
                viewport={viewport}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - AI Chat */}
        <div className="w-96 border-l flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </h2>
          </div>
          <AIChatPanel
            projectId={project.id}
            model={aiModel}
            messages={messages}
            onMessagesChange={setMessages}
            onCodeGenerated={(code, filename) => {
              const language = filename.endsWith(".tsx") || filename.endsWith(".ts")
                ? "typescript"
                : filename.endsWith(".css")
                ? "css"
                : filename.endsWith(".dart")
                ? "dart"
                : "javascript";
              
              const existingFile = files.find(f => f.path === filename);
              if (existingFile) {
                handleFileChange(filename, code);
              } else {
                handleAddFile(filename, code, language);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
