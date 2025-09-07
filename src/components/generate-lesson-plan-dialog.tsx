
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Save, Sparkles, Send } from "lucide-react";
import { generateLessonPlan, GenerateLessonPlanInput } from "@/ai/flows/generate-lesson-plan";
import { improveLessonPlan } from "@/ai/flows/improve-lesson-plan";
import type { TeacherResource } from "@/lib/types";

interface GenerateLessonPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResourceSaved: () => void;
}

export function GenerateLessonPlanDialog({ open, onOpenChange, onResourceSaved }: GenerateLessonPlanDialogProps) {
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [improvementRequest, setImprovementRequest] = useState("");
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPlan).then(() => {
        toast({
            title: "Copied to Clipboard",
            description: "The lesson plan has been copied.",
        });
    });
  };
  
  const handleSave = () => {
    if (!generatedPlan) return;
    
    const newPlan: TeacherResource = {
      id: `lesson_${Date.now()}`,
      title: currentTopic || "Untitled Lesson Plan",
      content: generatedPlan,
      createdAt: new Date().toISOString(),
      type: 'Lesson Plan'
    };

    const existingResources = JSON.parse(localStorage.getItem("teacherResources") || "[]");
    localStorage.setItem("teacherResources", JSON.stringify([newPlan, ...existingResources]));
    
    toast({
      title: "Lesson Plan Saved!",
      description: `"${newPlan.title}" has been added to your resources.`,
    });

    onOpenChange(false);
    onResourceSaved(); // Notify parent to switch tabs
  };

  const handleInitialSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedPlan("");

    const formData = new FormData(event.currentTarget);
    const data: GenerateLessonPlanInput = {
      subject: formData.get("subject") as string,
      topic: formData.get("topic") as string,
      gradeLevel: formData.get("gradeLevel") as string,
      learningObjectives: formData.get("learningObjectives") as string,
    };
    
    setCurrentTopic(data.topic);
    
    try {
        const result = await generateLessonPlan(data);
        if (result.lessonPlan) {
            setGeneratedPlan(result.lessonPlan);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error generating lesson plan",
            description: "An unexpected error occurred. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  };

  const handleImprovementSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!improvementRequest.trim()) return;

    setImproving(true);
    try {
      const result = await improveLessonPlan({
        lessonPlan: generatedPlan,
        request: improvementRequest,
      });
      if (result.revisedLessonPlan) {
        setGeneratedPlan(result.revisedLessonPlan);
      }
      setImprovementRequest(""); // Clear input after submission
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error improving lesson plan",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setImproving(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            setGeneratedPlan(""); // Reset on close
        }
    }}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">Lesson Plan Generator</DialogTitle>
          <DialogDescription>
            {generatedPlan ? "Review your lesson plan and use the chat to make improvements." : "Use AI to generate a draft lesson plan. You can refine it with AI afterwards."}
          </DialogDescription>
        </DialogHeader>
        {!generatedPlan && !loading ? (
            <form onSubmit={handleInitialSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">Subject</Label>
                  <Input id="subject" name="subject" defaultValue="Mathematics" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topic" className="text-right">Topic</Label>
                  <Input id="topic" name="topic" defaultValue="Introduction to Algebra" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gradeLevel" className="text-right">Grade Level</Label>
                   <Select name="gradeLevel" defaultValue="Grade 7">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                                    Grade {i + 1}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="learningObjectives" className="text-right mt-2">Objectives</Label>
                  <Textarea id="learningObjectives" name="learningObjectives" placeholder="e.g., Understand variables, Solve simple linear equations" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Sparkles className="mr-2 h-4 w-4" /> Generate
                </Button>
              </DialogFooter>
            </form>
        ) : null}

        {(loading || generatedPlan) && (
             <div className="flex-1 flex flex-col min-h-0 border-t pt-4">
                {loading && (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                )}
                
                {generatedPlan && (
                  <>
                     <div className="flex justify-between items-center mb-2 flex-shrink-0">
                        <h3 className="font-bold text-lg">Generated Plan: <span className="text-muted-foreground font-normal">{currentTopic}</span></h3>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy plan">
                                <Copy className="h-4 w-4" /> Copy
                            </Button>
                            <Button onClick={handleSave} title="Save to resources">
                                <Save className="mr-2 h-4 w-4" />
                                Save & Close
                            </Button>
                        </div>
                    </div>
                    <Textarea 
                        value={generatedPlan}
                        onChange={(e) => setGeneratedPlan(e.target.value)}
                        className="text-sm bg-muted whitespace-pre-wrap font-body flex-1"
                        readOnly={improving}
                    />

                    <form onSubmit={handleImprovementSubmit} className="mt-4 flex-shrink-0">
                       <Label htmlFor="improvementRequest" className="font-bold text-base flex items-center gap-2 mb-2">
                          <Sparkles className="text-accent h-5 w-5" />
                          Improve Your Lesson Plan
                       </Label>
                       <div className="flex items-center space-x-2">
                           <Input
                              id="improvementRequest"
                              name="improvementRequest"
                              placeholder="e.g., 'Add an activity for visual learners' or 'Make the introduction more engaging...'"
                              value={improvementRequest}
                              onChange={(e) => setImprovementRequest(e.target.value)}
                              disabled={improving}
                              className="flex-1"
                           />
                           <Button type="submit" disabled={improving || !improvementRequest.trim()}>
                             {improving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                             {improving ? 'Improving...' : 'Send'}
                           </Button>
                       </div>
                    </form>
                  </>
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
