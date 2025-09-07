
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Save } from "lucide-react";
import { generateWorksheet, GenerateWorksheetInput } from "@/ai/flows/generate-worksheet";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TeacherResource } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";

interface GenerateWorksheetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResourceSaved: () => void;
}

export function GenerateWorksheetDialog({ open, onOpenChange, onResourceSaved }: GenerateWorksheetDialogProps) {
  const [loading, setLoading] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const { toast } = useToast();
  const [numQuestions, setNumQuestions] = useState(5);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedWorksheet).then(() => {
        toast({
            title: "Copied to Clipboard",
        });
    });
  };

  const handleSave = () => {
    if (!generatedWorksheet) return;
    
    const newResource: TeacherResource = {
      id: `worksheet_${Date.now()}`,
      title: `${currentTopic || 'Untitled Worksheet'}`,
      content: generatedWorksheet,
      createdAt: new Date().toISOString(),
      type: 'Worksheet'
    };

    const existingResources: TeacherResource[] = JSON.parse(localStorage.getItem("teacherResources") || "[]");
    localStorage.setItem("teacherResources", JSON.stringify([newResource, ...existingResources]));
    
    toast({
      title: "Worksheet Saved!",
      description: `"${newResource.title}" has been added to your resources.`,
    });

    onOpenChange(false);
    onResourceSaved();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedWorksheet("");

    const formData = new FormData(event.currentTarget);
    const data: GenerateWorksheetInput = {
      grade: formData.get("grade") as string,
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      numQuestions: numQuestions.toString(),
    };
    
    setCurrentTopic(data.topic);

    try {
        const result = await generateWorksheet(data);
        if (result.worksheet) {
            setGeneratedWorksheet(result.worksheet);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error generating worksheet",
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
            setGeneratedWorksheet("");
            setCurrentTopic("");
        }
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Worksheet Generator</DialogTitle>
          <DialogDescription>
            Generate a custom worksheet complete with an answer key. You can edit the result after generation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh]">
            <form onSubmit={handleSubmit} className="space-y-4 pr-4 overflow-y-auto">
                <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                     <Select name="grade" defaultValue="Grade 5">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" defaultValue="Science" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input id="topic" name="topic" placeholder="e.g., The Water Cycle, Fractions" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
                    <Slider id="numQuestions" name="numQuestions" min={1} max={15} step={1} value={[numQuestions]} onValueChange={(value) => setNumQuestions(value[0])} />
                </div>
              <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Worksheet
                </Button>
              </DialogFooter>
            </form>
             <div className="border-l border-border pl-8 flex flex-col">
                 <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h3 className="font-bold">Generated Worksheet:</h3>
                    {generatedWorksheet && (
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
                {generatedWorksheet && (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 overflow-y-auto flex-grow border rounded-md p-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedWorksheet}</ReactMarkdown>
                    </div>
                )}
                 {!loading && !generatedWorksheet && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8 bg-muted/50 rounded-lg">
                        <p>Your generated worksheet will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
