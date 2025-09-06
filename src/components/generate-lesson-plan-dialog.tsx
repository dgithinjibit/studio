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
import { Loader2 } from "lucide-react";
import { generateLessonPlan, GenerateLessonPlanInput } from "@/ai/flows/generate-lesson-plan";

export function GenerateLessonPlanDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Generate Lesson Plan</DialogTitle>
          <DialogDescription>
            Use AI to generate a draft lesson plan. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
              <Input id="gradeLevel" name="gradeLevel" defaultValue="Form 1" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="learningObjectives" className="text-right mt-2">Objectives</Label>
              <Textarea id="learningObjectives" name="learningObjectives" placeholder="e.g., Understand variables, Solve simple linear equations" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </form>
        {generatedPlan && (
            <div className="mt-4 border-t pt-4">
                <h3 className="font-bold mb-2">Generated Plan:</h3>
                <pre className="text-sm bg-muted p-4 rounded-md whitespace-pre-wrap font-body">{generatedPlan}</pre>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
