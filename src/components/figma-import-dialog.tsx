"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Figma, Loader2 } from "lucide-react";

interface FigmaImportDialogProps {
  framework: string;
  onImport: (code: string) => void;
}

export function FigmaImportDialog({ framework, onImport }: FigmaImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figmaUrl: url,
          framework: framework.includes("native") ? "react-native" : "react",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to import Figma design");
      }

      const data = await response.json();
      onImport(data.code);
      setOpen(false);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Figma className="w-4 h-4 mr-2" />
          Import Figma
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Figma className="w-5 h-5" />
            Import from Figma
          </DialogTitle>
          <DialogDescription>
            Paste your Figma file or frame URL to convert it to{" "}
            {framework.includes("native") ? "React Native" : "React"} code.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Figma URL</label>
            <Input
              placeholder="https://www.figma.com/file/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Paste the URL of your Figma file or select a specific frame
            </p>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">How it works:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Open your design in Figma</li>
              <li>Copy the URL from your browser</li>
              <li>Paste it here and click Import</li>
              <li>The design will be converted to code</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || !url.trim()}
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Import Design
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
