
"use client";

import { useState, useMemo } from "react";
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
import { Loader2, Save, Copy, ArrowRight } from "lucide-react";
import { generateSchemeOfWork, GenerateSchemeOfWorkInput } from "@/ai/flows/generate-scheme-of-work";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TeacherResource } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { storage, db } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { grade4AgricultureCurriculum } from "@/curriculum/grade4-agriculture";

// In a real app, you would have a system to import all curriculum files.
const allCurricula = [grade4AgricultureCurriculum];

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
  const [lessonsPerWeek, setLessonsPerWeek] = useState(3);
  
  // State for the multi-step form
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStrand, setSelectedStrand] = useState('');
  const [selectedSubStrand, setSelectedSubStrand] = useState('');

  const availableSubjects = useMemo(() => {
    if (!selectedGrade) return [];
    return [...new Set(allCurricula.filter(c => c.grade === selectedGrade).map(c => c.subject))];
  }, [selectedGrade]);

  const availableStrands = useMemo(() => {
    if (!selectedSubject) return [];
    const curriculum = allCurricula.find(c => c.grade === selectedGrade && c.subject === selectedSubject);
    return curriculum ? curriculum.strands.map(s => s.title) : [];
  }, [selectedSubject, selectedGrade]);

  const availableSubStrands = useMemo(() => {
    if (!selectedStrand) return [];
    const curriculum = allCurricula.find(c => c.grade === selectedGrade && c.subject === selectedSubject);
    const strand = curriculum?.strands.find(s => s.title === selectedStrand);
    return strand ? strand.sub_strands.map(ss => ss.title) : [];
  }, [selectedStrand, selectedSubject, selectedGrade]);


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
    const data: GenerateSchemeOfWorkInput = {
      subject: selectedSubject,
      grade: selectedGrade,
      subStrand: selectedSubStrand,
      availableResources: formData.get("availableResources") as string,
      numberOfWeeks: "1",
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
  
  const resetForm = () => {
      setSelectedGrade('');
      setSelectedSubject('');
      setSelectedStrand('');
      setSelectedSubStrand('');
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
             Create a one-week, CBC-compliant Scheme of Work. Select the grade, subject, strand, and sub-strand to begin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Step 1: Grade */}
                <div className="space-y-2">
                    <Label htmlFor="grade">1. Select Grade</Label>
                    <Select name="grade" value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger id="grade">
                            <SelectValue placeholder="Choose a grade level..." />
                        </SelectTrigger>
                        <SelectContent>
                            {[...new Set(allCurricula.map(c => c.grade))].map(grade => (
                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Step 2: Subject */}
                {selectedGrade && (
                     <div className="space-y-2">
                        <Label htmlFor="subject">2. Select Subject</Label>
                        <Select name="subject" value={selectedSubject} onValueChange={setSelectedSubject} disabled={!availableSubjects.length}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a subject..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSubjects.map(subject => (
                                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                
                {/* Step 3: Strand */}
                 {selectedSubject && (
                     <div className="space-y-2">
                        <Label htmlFor="strand">3. Select Strand</Label>
                        <Select name="strand" value={selectedStrand} onValueChange={setSelectedStrand} disabled={!availableStrands.length}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a strand..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableStrands.map(strand => (
                                    <SelectItem key={strand} value={strand}>{strand}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                 {/* Step 4: Sub-Strand */}
                 {selectedStrand && (
                     <div className="space-y-2">
                        <Label htmlFor="subStrand">4. Select Sub-Strand</Label>
                        <Select name="subStrand" value={selectedSubStrand} onValueChange={setSelectedSubStrand} disabled={!availableSubStrands.length}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a sub-strand..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSubStrands.map(ss => (
                                    <SelectItem key={ss} value={ss}>{ss}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {selectedSubStrand && (
                    <>
                         <div>
                            <Label htmlFor="lessonsPerWeek">5. Lessons per Week: {lessonsPerWeek}</Label>
                            <Slider id="lessonsPerWeek" name="lessonsPerWeek" min={1} max={5} step={1} value={[lessonsPerWeek]} onValueChange={(value) => setLessonsPerWeek(value[0])} />
                        </div>
                         <div>
                            <Label htmlFor="availableResources">6. Available Resources</Label>
                            <Textarea id="availableResources" name="availableResources" defaultValue="Chalkboard, textbooks, local environment" />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Scheme for 1 Week
                            </Button>
                        </DialogFooter>
                    </>
                )}
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
                        <p>Your generated scheme of work will appear here once you've selected all the options.</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
