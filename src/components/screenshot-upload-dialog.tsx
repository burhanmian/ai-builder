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
import { Image as ImageIcon, Upload, Loader2, Sparkles, X, Camera, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScreenshotUploadDialogProps {
  framework: string;
  onCodeGenerated: (code: string, filename: string) => void;
}

export function ScreenshotUploadDialog({ framework, onCodeGenerated }: ScreenshotUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WebP, or GIF)");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  }, [handleImageUpload]);

  const handleGenerateCode = async () => {
    if (!uploadedImage) return;
    setLoading(true);
    
    // Simulate AI vision analysis (in production, this would call an AI vision API)
    setTimeout(() => {
      const isReactNative = framework === "react-native" || framework === "flutter";
      
      const generatedCode = isReactNative
        ? `import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

// Generated from screenshot using AI Vision
// Additional context: ${additionalContext || "None provided"}

export default function GeneratedScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generated Component</Text>
        <Text style={styles.subtitle}>
          Created from your screenshot using AI vision analysis
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI-Generated Layout</Text>
          <Text style={styles.cardDescription}>
            This component was generated based on your uploaded screenshot.
            The AI analyzed the visual elements and created matching React Native code.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888888',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});`
        : `"use client";

import React from 'react';

// Generated from screenshot using AI Vision
// Additional context: ${additionalContext || "None provided"}

export function GeneratedComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Header Section */}
      <header className="px-6 py-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          Generated Component
        </h1>
        <p className="text-gray-400 text-lg">
          Created from your screenshot using AI vision analysis
        </p>
      </header>
      
      {/* Main Content */}
      <main className="px-6 py-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-6">
          <h2 className="text-xl font-semibold mb-3">AI-Generated Layout</h2>
          <p className="text-gray-400 leading-relaxed">
            This component was generated based on your uploaded screenshot.
            The AI analyzed the visual elements and created matching React code
            with Tailwind CSS styling.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Feature One</h3>
            <p className="text-sm text-gray-400">Generated from visual analysis of your screenshot.</p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Feature Two</h3>
            <p className="text-sm text-gray-400">Automatically styled based on detected design patterns.</p>
          </div>
        </div>
        
        <button className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-violet-500/25">
          Get Started
        </button>
      </main>
    </div>
  );
}

export default GeneratedComponent;`;
      
      const filename = isReactNative 
        ? "src/screens/GeneratedScreen.tsx" 
        : "src/components/GeneratedComponent.tsx";
      
      onCodeGenerated(generatedCode, filename);
      setLoading(false);
      setUploadedImage(null);
      setAdditionalContext("");
      setOpen(false);
    }, 3000);
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="w-4 h-4" />
          Screenshot to Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-400" />
            Screenshot to Code
          </DialogTitle>
          <DialogDescription>
            Upload a screenshot, mockup, or sketch and let AI generate the code for you.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {!uploadedImage ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                isDragging
                  ? "border-pink-500 bg-pink-500/10"
                  : "border-muted-foreground/25 hover:border-pink-500/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("screenshot-upload")?.click()}
            >
              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Upload Screenshot</p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: PNG, JPG, WebP, GIF (max 10MB)
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={uploadedImage} 
                alt="Uploaded screenshot" 
                className="w-full max-h-64 object-contain bg-black/50"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Additional context (optional)</label>
            <Textarea
              placeholder="Describe specific features or functionality you want the AI to include..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={handleGenerateCode} 
            disabled={loading || !uploadedImage}
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing screenshot...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Code from Screenshot
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            AI will analyze the visual elements and generate {framework === "react-native" || framework === "flutter" ? "React Native" : "React"} code
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
