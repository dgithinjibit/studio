
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Copy } from "lucide-react";
import { generateSchemeOfWork, GenerateSchemeOfWorkInput } from "@/ai/flows/generate-scheme-of-work";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TeacherResource } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { storage, db } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { Input } from "./ui/input";
import { grade6SocialStudiesCurriculum } from "@/curriculum/grade6-social-studies";


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
  const [lessonsPerWeek, setLessonsPerWeek] = useState(5);

  // State for data-driven form
  const [selectedGrade, setSelectedGrade] = useState("Grade 6");
  const [selectedSubject, setSelectedSubject] = useState("Social Studies");
  const [selectedStrand, setSelectedStrand] = useState("");
  const [selectedSubStrand, setSelectedSubStrand] = useState("");


  const availableStrands = useMemo(() => {
    if (selectedGrade === "Grade 6" && selectedSubject === "Social Studies") {
      return grade6SocialStudiesCurriculum.strands;
    }
    return [];
  }, [selectedGrade, selectedSubject]);

  const availableSubStrands = useMemo(() => {
    if (selectedStrand) {
      const strand = availableStrands.find(s => s.title === selectedStrand);
      return strand?.sub_strands || [];
    }
    return [];
  }, [selectedStrand, availableStrands]);


  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScheme).then(() => {
        toast({
            title: "Copied to Clipboard",
        });
    });
  };

  const handleSave = async () => {
    if (!generatedScheme) return;
    
    setLoading(true);

    try {
        const fileName = `schemes_of_work/${Date.now()}_${currentSubStrand.replace(/\s+/g, '_')}.md`;
        const storageRef = ref(storage, fileName);
        
        await uploadString(storageRef, generatedScheme, 'raw', { contentType: 'text/markdown' });
        const downloadURL = await getDownloadURL(storageRef);

        const newResource: Omit<TeacherResource, 'id'> = {
          title: `${currentSubStrand} - Scheme of Work`,
          url: downloadURL,
          createdAt: new Date().toISOString(),
          type: 'Scheme of Work'
        };

        await addDoc(collection(db, "teacherResources"), newResource);
        
        toast({
          title: "Scheme of Work Saved!",
          description: `"${newResource.title}" has been added to your library.`,
        });

        onOpenChange(false);
        onResourceSaved();
    } catch (error) {
        console.error("Error saving scheme of work:", error);
        toast({
            variant: "destructive",
            title: "Error Saving Scheme",
            description: "Could not save the scheme of work to the cloud. Please try again."
        });
    } finally {
        setLoading(false);
    }
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedScheme("");

    const formData = new FormData(event.currentTarget);
    const subStrandData = availableSubStrands.find(ss => ss.title === selectedSubStrand);
    
    if (!subStrandData) {
        toast({
            variant: "destructive",
            title: "Invalid Selection",
            description: "Please select a valid strand and sub-strand.",
        });
        setLoading(false);
        return;
    }
    
    // Create a detailed context string from the selected curriculum data
    const contextString = `
        Learning Outcomes: ${subStrandData.learning_outcomes.join('; ')}
        Suggested Activities: ${subStrandData.suggested_activities.join('; ')}
        Key Inquiry Question: ${subStrandData.key_inquiry_questions.join('; ')}
    `;

    const data: GenerateSchemeOfWorkInput = {
      subject: selectedSubject,
      grade: selectedGrade,
      subStrand: selectedSubStrand,
      availableResources: formData.get("availableResources") as string,
      numberOfWeeks: "1", // Default to 1 week for this generator
      lessonsPerWeek: lessonsPerWeek.toString(),
      // Pass the detailed context to the AI
      schemeOfWorkContext: contextString, 
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
  
  const resetForm = () => {
      setGeneratedScheme('');
      setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Schemer: Week Generator</DialogTitle>
          <DialogDescription>
             Create a one-week, CBC-compliant Scheme of Work by providing your own curriculum details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="grade">Grade Level</Label>
                        <Select name="grade" value={selectedGrade} onValueChange={setSelectedGrade} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Grade 6">Grade 6</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select name="subject" value={selectedSubject} onValueChange={setSelectedSubject} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Social Studies">Social Studies</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="strand">Strand</Label>
                    <Select name="strand" value={selectedStrand} onValueChange={v => { setSelectedStrand(v); setSelectedSubStrand(''); }} required>
                        <SelectTrigger disabled={!availableStrands.length}>
                            <SelectValue placeholder="Select a strand" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableStrands.map(s => (
                                <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subStrand">Sub-Strand</Label>
                    <Select name="subStrand" value={selectedSubStrand} onValueChange={setSelectedSubStrand} required>
                        <SelectTrigger disabled={!availableSubStrands.length}>
                            <SelectValue placeholder="Select a sub-strand" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSubStrands.map(ss => (
                                <SelectItem key={ss.title} value={ss.title}>{ss.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <Label htmlFor="lessonsPerWeek">Lessons per Week: {lessonsPerWeek}</Label>
                    <Slider id="lessonsPerWeek" name="lessonsPerWeek" min={1} max={5} step={1} value={[lessonsPerWeek]} onValueChange={(value) => setLessonsPerWeek(value[0])} />
                </div>
                 <div>
                    <Label htmlFor="availableResources">Available Resources</Label>
                    <Textarea id="availableResources" name="availableResources" defaultValue="Map of Eastern Africa, digital resources, charts" />
                </div>
                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={loading || !selectedSubStrand} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Scheme for 1 Week
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
                             <Button onClick={handleSave} disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
                        <p>Your generated scheme of work will appear here once you fill out the details.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
