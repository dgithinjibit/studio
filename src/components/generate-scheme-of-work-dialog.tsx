
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Copy } from "lucide-react";
import { generateSchemeOfWork, GenerateSchemeOfWorkInput } from "@/ai/flows/generate-scheme-of-work";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TeacherResource } from "@/lib/types";

interface GenerateSchemeOfWorkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResourceSaved: () => void;
}

export function GenerateSchemeOfWorkDialog({ open, onOpenChange, onResourceSaved }: GenerateSchemeOfWorkDialogProps) {
  const [loading, setLoading] = useState(false);
  const [generatedScheme, setGeneratedScheme] = useState("");
  const [currentSubStrand, setCurrentSubStrand] = useState("");
  const { toast } = useToast();
  const [weeks, setWeeks] = useState(6);
  const [lessonsPerWeek, setLessonsPerWeek] = useState(3);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScheme).then(() => {
        toast({
            title: "Copied to Clipboard",
        });
    });
  };

  const handleSave = () => {
    if (!generatedScheme) return;
    
    const newResource: TeacherResource = {
      id: `scheme_${Date.now()}`,
      title: currentSubStrand || "Untitled Scheme of Work",
      content: generatedScheme,
      createdAt: new Date().toISOString(),
      type: 'Scheme of Work'
    };

    const existingResources: TeacherResource[] = JSON.parse(localStorage.getItem("teacherResources") || "[]");
    localStorage.setItem("teacherResources", JSON.stringify([newResource, ...existingResources]));
    
    toast({
      title: "Scheme of Work Saved!",
      description: `"${newResource.title}" has been added to your resources.`,
    });

    onOpenChange(false);
    onResourceSaved();
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedScheme("");

    const formData = new FormData(event.currentTarget);
    const data: GenerateSchemeOfWorkInput = {
      subject: formData.get("subject") as string,
      grade: formData.get("grade") as string,
      subStrand: formData.get("subStrand") as string,
      availableResources: formData.get("availableResources") as string,
      numberOfWeeks: weeks.toString(),
      lessonsPerWeek: lessonsPerWeek.toString(),
    };
    setCurrentSubStrand(data.subStrand);
    
    try {
        const result = await generateSchemeOfWork(data);
        if (result.schemeOfWork) {
            setGeneratedScheme(result.schemeOfWork);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error generating scheme of work",
            description: "An unexpected error occurred. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setGeneratedScheme("");
        }
    }}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Schemer: Schemes of Work Creator</DialogTitle>
          <DialogDescription>
            Create CBC-compliant Schemes of Work in official table format. You can edit the generated content.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" defaultValue="Mathematics" />
                </div>
                 <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" name="grade" defaultValue="4" />
                </div>
                 <div>
                    <Label htmlFor="subStrand">Sub-Strand</Label>
                    <Input id="subStrand" name="subStrand" placeholder="e.g., Numbers, Grammar, Living Things" />
                </div>
                <div>
                    <Label htmlFor="numberOfWeeks">Number of Weeks: {weeks}</Label>
                    <Slider id="numberOfWeeks" name="numberOfWeeks" min={1} max={12} step={1} value={[weeks]} onValueChange={(value) => setWeeks(value[0])} />
                </div>
                 <div>
                    <Label htmlFor="lessonsPerWeek">Lessons per Week: {lessonsPerWeek}</Label>
                    <Slider id="lessonsPerWeek" name="lessonsPerWeek" min={1} max={5} step={1} value={[lessonsPerWeek]} onValueChange={(value) => setLessonsPerWeek(value[0])} />
                </div>
                 <div>
                    <Label htmlFor="availableResources">Available Resources</Label>
                    <Textarea id="availableResources" name="availableResources" defaultValue="Chalkboard, basic materials" />
                </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Scheme of Work
                </Button>
              </DialogFooter>
            </form>
             <div className="border-l border-border pl-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Generated Scheme of Work:</h3>
                    {generatedScheme && (
                         <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                            </Button>
                             <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        </div>
                    )}
                </div>
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {generatedScheme && (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 overflow-auto h-[500px] border rounded-md p-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScheme}</ReactMarkdown>
                    </div>
                )}
                 {!loading && !generatedScheme && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8 bg-muted/50 rounded-lg">
                        <p>Your generated scheme of work will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
