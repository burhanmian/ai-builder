"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Globe, Smartphone, Loader2 } from "lucide-react";

export function CreateProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "web",
    framework: "react",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const project = await response.json();
      setOpen(false);
      router.push(`/project/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const frameworks = formData.type === "web"
    ? [
        { value: "react", label: "React" },
        { value: "nextjs", label: "Next.js" },
      ]
    : [
        { value: "react-native", label: "React Native" },
        { value: "flutter", label: "Flutter" },
      ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Start a new project and build with AI-powered code generation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                placeholder="My Awesome App"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                placeholder="A brief description of your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === "web"
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-border hover:border-violet-500/50"
                  }`}
                  onClick={() => setFormData({ ...formData, type: "web", framework: "react" })}
                >
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-medium">Web App</p>
                  <p className="text-xs text-muted-foreground">React, Next.js</p>
                </button>
                <button
                  type="button"
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === "android"
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-border hover:border-violet-500/50"
                  }`}
                  onClick={() => setFormData({ ...formData, type: "android", framework: "react-native" })}
                >
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="font-medium">Android App</p>
                  <p className="text-xs text-muted-foreground">React Native, Flutter</p>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Framework</label>
              <Select
                value={formData.framework}
                onValueChange={(value) => setFormData({ ...formData, framework: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.value} value={fw.value}>
                      {fw.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
