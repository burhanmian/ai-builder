"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderUp, FileCode, Github, Upload, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportCodeDialogProps {
  onImport: (files: Array<{ path: string; content: string; language: string }>) => void;
}

export function ImportCodeDialog({ onImport }: ImportCodeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pastedCode, setPastedCode] = useState("");
  const [fileName, setFileName] = useState("component.tsx");
  const [githubUrl, setGithubUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string }>>([]);

  const handlePasteImport = () => {
    if (!pastedCode.trim()) return;
    
    const language = fileName.endsWith(".tsx") || fileName.endsWith(".ts")
      ? "typescript"
      : fileName.endsWith(".css")
      ? "css"
      : fileName.endsWith(".json")
      ? "json"
      : "javascript";

    onImport([{ 
      path: fileName.startsWith("src/") ? fileName : `src/${fileName}`, 
      content: pastedCode, 
      language 
    }]);
    
    setPastedCode("");
    setFileName("component.tsx");
    setOpen(false);
  };

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files) return;
    setLoading(true);
    
    const importedFiles: Array<{ path: string; content: string; language: string }> = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await file.text();
      const ext = file.name.split(".").pop() || "";
      
      let language = "plaintext";
      if (["ts", "tsx"].includes(ext)) language = "typescript";
      else if (["js", "jsx"].includes(ext)) language = "javascript";
      else if (ext === "css") language = "css";
      else if (ext === "json") language = "json";
      else if (ext === "html") language = "html";
      else if (ext === "dart") language = "dart";
      
      importedFiles.push({
        path: `src/${file.name}`,
        content,
        language,
      });
      
      setUploadedFiles(prev => [...prev, { name: file.name, content }]);
    }
    
    if (importedFiles.length > 0) {
      onImport(importedFiles);
    }
    
    setLoading(false);
    setTimeout(() => {
      setUploadedFiles([]);
      setOpen(false);
    }, 1500);
  }, [onImport]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleGithubImport = async () => {
    if (!githubUrl.trim()) return;
    setLoading(true);
    
    // Simulate GitHub import (in production, this would fetch from GitHub API)
    setTimeout(() => {
      // Demo: Create a sample file from GitHub URL
      const repoName = githubUrl.split("/").pop() || "imported-project";
      onImport([{
        path: `src/${repoName}/index.tsx`,
        content: `// Imported from: ${githubUrl}\n\nexport function App() {\n  return (\n    <div>\n      <h1>Imported from GitHub</h1>\n      <p>Repository: ${githubUrl}</p>\n    </div>\n  );\n}`,
        language: "typescript"
      }]);
      setLoading(false);
      setGithubUrl("");
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderUp className="w-4 h-4" />
          Import Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderUp className="w-5 h-5 text-violet-400" />
            Import Existing Code
          </DialogTitle>
          <DialogDescription>
            Import your existing code by uploading files, pasting code, or connecting to GitHub.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <FileCode className="w-4 h-4" />
              Paste
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-muted-foreground/25 hover:border-violet-500/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.dart,.txt"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              
              {loading ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 mx-auto text-violet-400 animate-spin" />
                  <p className="text-sm text-muted-foreground">Processing files...</p>
                </div>
              ) : uploadedFiles.length > 0 ? (
                <div className="space-y-3">
                  <Check className="w-10 h-10 mx-auto text-green-500" />
                  <p className="text-sm text-green-400">{uploadedFiles.length} file(s) imported!</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Drag & drop files here</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse your files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: .js, .jsx, .ts, .tsx, .css, .html, .json, .dart
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File name</label>
              <Input
                placeholder="component.tsx"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Paste your code</label>
              <Textarea
                placeholder="// Paste your code here..."
                value={pastedCode}
                onChange={(e) => setPastedCode(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <Button 
              onClick={handlePasteImport} 
              disabled={!pastedCode.trim()}
              className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              Import Code
            </Button>
          </TabsContent>

          <TabsContent value="github" className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Repository URL</label>
              <Input
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL of a public GitHub repository
              </p>
            </div>
            <Button 
              onClick={handleGithubImport} 
              disabled={loading || !githubUrl.trim()}
              className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  Import from GitHub
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
