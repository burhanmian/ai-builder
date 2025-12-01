"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { File, Folder, ChevronRight } from "lucide-react";
import type { ProjectFile } from "@/types";
import { useState, useMemo } from "react";

interface FileTreeProps {
  files: ProjectFile[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  language?: string;
  content?: string;
}

function buildTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");

      let node = current.find((n) => n.name === name);

      if (!node) {
        node = {
          name,
          path,
          type: isFile ? "file" : "folder",
          ...(isFile ? { language: file.language, content: file.content } : { children: [] }),
        };
        current.push(node);
      }

      if (!isFile && node.children) {
        current = node.children;
      }
    }
  }

  // Sort: folders first, then files, alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((node) =>
        node.children ? { ...node, children: sortNodes(node.children) } : node
      );
  };

  return sortNodes(root);
}

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  
  const colors: Record<string, string> = {
    tsx: "text-blue-400",
    ts: "text-blue-400",
    jsx: "text-yellow-400",
    js: "text-yellow-400",
    css: "text-pink-400",
    html: "text-orange-400",
    json: "text-green-400",
    dart: "text-cyan-400",
    md: "text-gray-400",
  };

  return colors[ext || ""] || "text-gray-400";
}

interface TreeItemProps {
  node: TreeNode;
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  level: number;
}

function TreeItem({ node, activeFile, onFileSelect, level }: TreeItemProps) {
  const [expanded, setExpanded] = useState(level < 2);

  if (node.type === "folder") {
    return (
      <div>
        <button
          className="w-full flex items-center gap-1 py-1 px-2 hover:bg-muted/50 rounded text-sm"
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform text-muted-foreground",
              expanded && "rotate-90"
            )}
          />
          <Folder className="w-4 h-4 text-yellow-500" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded text-sm",
        activeFile === node.path && "bg-muted"
      )}
      style={{ paddingLeft: `${level * 12 + 20}px` }}
      onClick={() => onFileSelect(node.path)}
    >
      <File className={cn("w-4 h-4", getFileIcon(node.name))} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {tree.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No files yet
          </p>
        ) : (
          tree.map((node) => (
            <TreeItem
              key={node.path}
              node={node}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              level={0}
            />
          ))
        )}
      </div>
    </ScrollArea>
  );
}
