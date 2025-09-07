
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { generateRubric, GenerateRubricInput } from "@/ai/flows/generate-rubric";
import ReactMarkdown from 'react-markdown';

export function GenerateRubricDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [generatedRubric, setGeneratedRubric] = useState("");
  const { toast } = useToast();
  const [levels, setLevels] = useState(3);
  const [useWebSearch, setUseWebSearch] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedRubric("");

    const formData = new FormData(event.currentTarget);
    const data: GenerateRubricInput = {
      grade: formData.get("grade") as string,
      learningObjective: formData.get("learningObjective") as string,
      assignmentDescription: formData.get("assignmentDescription") as string,
      criteria: formData.get("criteria") as string,
      standards: formData.get("standards") as string,
      levels: levels.toString(),
      webSearch: useWebSearch,
    };
    
    try {
        const result = await generateRubric(data);
        if (result.rubric) {
            setGeneratedRubric(result.rubric);
        }
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error generating rubric",
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
            setGeneratedRubric("");
        }
    }}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Rubric Generator</DialogTitle>
          <DialogDescription>
            Generate a custom rubric for any assignment. You can edit the result after generation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Input id="grade" name="grade" defaultValue="5th Grade" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="levels">Number of Performance Levels: {levels}</Label>
                    <Slider id="levels" name="levels" min={2} max={5} step={1} value={[levels]} onValueChange={(value) => setLevels(value[0])} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="learningObjective">Learning Objective (SWBAT)</Label>
                    <Textarea id="learningObjective" name="learningObjective" placeholder="e.g., SWBAT write an argumentative essay" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assignmentDescription">Assignment Description</Label>
                    <Textarea id="assignmentDescription" name="assignmentDescription" placeholder="e.g., Write a persuasive essay that convinces the reader to change a school policy of your choosing" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="criteria">Specific Criteria to Assess</Label>
                    <Textarea id="criteria" name="criteria" placeholder="e.g., Be sure to include supporting arguments as a category assessed" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="standards">Standards</Label>
                    <Input id="standards" name="standards" placeholder="e.g., CCSS, TEKS, Ontario, Florida" />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="web-search" checked={useWebSearch} onCheckedChange={setUseWebSearch} />
                    <Label htmlFor="web-search">Enable Web Search</Label>
                </div>
              <DialogFooter className="pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Rubric
                </Button>
              </DialogFooter>
            </form>
             <div className="border-l border-border pl-8">
                <h3 className="font-bold mb-2">Generated Rubric:</h3>
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {generatedRubric && (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 overflow-auto h-[500px]">
                        <ReactMarkdown>{generatedRubric}</ReactMarkdown>
                    </div>
                )}
                 {!loading && !generatedRubric && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8 bg-muted/50 rounded-lg">
                        <p>Your generated rubric will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
