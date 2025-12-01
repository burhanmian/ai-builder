import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  path: string;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "google";
  description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  createdAt: Date;
}

export type ProjectType = "web" | "android";
export type Framework = "react" | "nextjs" | "react-native" | "flutter";
export type Viewport = "desktop" | "tablet" | "mobile";
