
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

// Grade 1
import { grade1CreativeActivitiesCurriculum } from "@/curriculum/grade1-creative-activities";
import { grade1EnglishLanguageActivitiesCurriculum } from "@/curriculum/grade1-english-language-activities";
import { grade1IndigenousLanguageCurriculum } from "@/curriculum/grade1-indigenous-language";
import { grade1KiswahiliLanguageActivitiesCurriculum } from "@/curriculum/grade1-kiswahili-language-activities";
import { grade1MathematicsActivitiesCurriculum } from "@/curriculum/grade1-mathematics-activities";
import { grade1CreCurriculum } from "@/curriculum/grade1-cre";
import { grade1EnvironmentalActivitiesCurriculum } from "@/curriculum/grade1-environmental-activities";

// Grade 2
import { grade2CreCurriculum } from "@/curriculum/grade2-cre";
import { grade2CreativeActivitiesCurriculum } from "@/curriculum/grade2-creative-activities";
import { grade2EnglishLanguageActivitiesCurriculum } from "@/curriculum/grade2-english-language-activities";
import { grade2IndigenousLanguageCurriculum } from "@/curriculum/grade2-indigenous-language";
import { grade2KiswahiliLanguageActivitiesCurriculum } from "@/curriculum/grade2-kiswahili-language-activities";
import { grade2EnvironmentalActivitiesCurriculum } from "@/curriculum/grade2-environmental-activities";
import { grade2MathematicsActivitiesCurriculum } from "@/curriculum/grade2-mathematics-activities";

// Grade 3
import { grade3CreCurriculum } from "@/curriculum/grade3-cre";
import { grade3CreativeActivitiesCurriculum } from "@/curriculum/grade3-creative-activities";
import { grade3EnglishLanguageActivitiesCurriculum } from "@/curriculum/grade3-english-language-activities";
import { grade3EnvironmentalActivitiesCurriculum } from "@/curriculum/grade3-environmental-activities";
import { grade3IndigenousLanguageCurriculum } from "@/curriculum/grade3-indigenous-language";
import { grade3KiswahiliLanguageActivitiesCurriculum } from "@/curriculum/grade3-kiswahili-language-activities";
import { grade3MathematicsActivitiesCurriculum } from "@/curriculum/grade3-mathematics-activities";


// Grade 4
import { grade4AgricultureAndNutritionCurriculum } from "@/curriculum/grade4-agriculture-and-nutrition";
import { grade4CreCurriculum } from "@/curriculum/grade4-cre";
import { grade4CreativeArtsCurriculum } from "@/curriculum/grade4-creative-arts";
import { grade4EnglishLanguageActivitiesCurriculum } from "@/curriculum/grade4-english-language-activities";
import { grade4IndigenousLanguageCurriculum } from "@/curriculum/grade4-indigenous-language";
import { grade4KiswahiliLanguageActivitiesCurriculum } from "@/curriculum/grade4-kiswahili-language-activities";


// Grade 5
import { grade5CreativeArtsCurriculum } from "@/curriculum/grade5-creative-arts";

// Grade 6
import { grade6SocialStudiesCurriculum } from "@/curriculum/grade6-social-studies";

// PP1 & PP2
import { pp1CreCurriculum } from "@/curriculum/pp1-cre";
import { pp2CreCurriculum } from "@/curriculum/pp2-cre";
import { pp1CreativeArtsCurriculum } from "@/curriculum/pp1-creative-arts";
import { pp2CreativeArtsCurriculum } from "@/curriculum/pp2-creative-arts";
import { pp1EnvironmentalActivitiesCurriculum } from "@/curriculum/pp1-environmental-activities";
import { pp2EnvironmentalActivitiesCurriculum } from "@/curriculum/pp2-environmental-activities";
import { pp1LanguageActivitiesCurriculum } from "@/curriculum/pp1-language-activities";
import { pp2LanguageActivitiesCurriculum } from "@/curriculum/pp2-language-activities";
import { pp1MathematicsActivitiesCurriculum } from "@/curriculum/pp1-mathematics-activities";
import { pp2MathematicsActivitiesCurriculum } from "@/curriculum/pp2-mathematics-activities";


const curriculumMap: { [key: string]: any } = {
    // PP1
    'PP1-Christian Religious Education': pp1CreCurriculum,
    'PP1-Creative Activities': pp1CreativeArtsCurriculum,
    'PP1-Environmental Activities': pp1EnvironmentalActivitiesCurriculum,
    'PP1-Language Activities': pp1LanguageActivitiesCurriculum,
    'PP1-Mathematical Activities': pp1MathematicsActivitiesCurriculum,
    // PP2
    'PP2-Christian Religious Education': pp2CreCurriculum,
    'PP2-Creative Activities': pp2CreativeArtsCurriculum,
    'PP2-Environmental Activities': pp2EnvironmentalActivitiesCurriculum,
    'PP2-Language Activities': pp2LanguageActivitiesCurriculum,
    'PP2-Mathematical Activities': pp2MathematicsActivitiesCurriculum,
    // Grade 1
    'Grade 1-Christian Religious Education': grade1CreCurriculum,
    'Grade 1-Creative Activities': grade1CreativeActivitiesCurriculum,
    'Grade 1-Environmental Activities': grade1EnvironmentalActivitiesCurriculum,
    'Grade 1-English Language Activities': grade1EnglishLanguageActivitiesCurriculum,
    'Grade 1-Indigenous Language Activities': grade1IndigenousLanguageCurriculum,
    'Grade 1-Kiswahili Language Activities': grade1KiswahiliLanguageActivitiesCurriculum,
    'Grade 1-Mathematical Activities': grade1MathematicsActivitiesCurriculum,
    // Grade 2
    'Grade 2-Christian Religious Education': grade2CreCurriculum,
    'Grade 2-Creative Activities': grade2CreativeActivitiesCurriculum,
    'Grade 2-Environmental Activities': grade2EnvironmentalActivitiesCurriculum,
    'Grade 2-English Language Activities': grade2EnglishLanguageActivitiesCurriculum,
    'Grade 2-Indigenous Language Activities': grade2IndigenousLanguageCurriculum,
    'Grade 2-Kiswahili Language Activities': grade2KiswahiliLanguageActivitiesCurriculum,
    'Grade 2-Mathematical Activities': grade2MathematicsActivitiesCurriculum,
    // Grade 3
    'Grade 3-Christian Religious Education': grade3CreCurriculum,
    'Grade 3-Creative Activities': grade3CreativeActivitiesCurriculum,
    'Grade 3-Environmental Activities': grade3EnvironmentalActivitiesCurriculum,
    'Grade 3-English Language Activities': grade3EnglishLanguageActivitiesCurriculum,
    'Grade 3-Indigenous Language Activities': grade3IndigenousLanguageCurriculum,
    'Grade 3-Kiswahili Language Activities': grade3KiswahiliLanguageActivitiesCurriculum,
    'Grade 3-Mathematical Activities': grade3MathematicsActivitiesCurriculum,
    // Grade 4
    'Grade 4-Agriculture and Nutrition': grade4AgricultureAndNutritionCurriculum,
    'Grade 4-Christian Religious Education': grade4CreCurriculum,
    'Grade 4-Creative Arts': grade4CreativeArtsCurriculum,
    'Grade 4-English': grade4EnglishLanguageActivitiesCurriculum,
    'Grade 4-Indigenous Languages': grade4IndigenousLanguageCurriculum,
    'Grade 4-Kiswahili': grade4KiswahiliLanguageActivitiesCurriculum,
    // Grade 5
    'Grade 5-Creative Arts': grade5CreativeArtsCurriculum,
    // Grade 6
    'Grade 6-Social Studies': grade6SocialStudiesCurriculum,
};

const availableGrades = Array.from(new Set(Object.keys(curriculumMap).map(key => key.split('-')[0])));

const getSubjectsForGrade = (grade: string) => {
    if (!grade) return [];
    const subjects = Object.keys(curriculumMap)
        .filter(key => key.startsWith(`${grade}-`))
        .map(key => key.split('-').slice(1).join('-'));
    return Array.from(new Set(subjects));
};


interface GenerateSchemeOfWorkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onResourceSaved: () => void;
}

export default function GenerateSchemeOfWorkDialog({ open, onOpenChange, onResourceSaved }: GenerateSchemeOfWorkDialogProps) {
  const [loading, setLoading] = useState(false);
  const [generatedScheme, setGeneratedScheme] = useState("");
  const [currentSubStrand, setCurrentSubStrand] = useState("");
  const { toast } = useToast();
  const [lessonsPerWeek, setLessonsPerWeek] = useState(5);

  // State for data-driven form
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStrand, setSelectedStrand] = useState("");
  const [selectedSubStrandName, setSelectedSubStrandName] = useState("");


  const availableSubjects = useMemo(() => {
    return getSubjectsForGrade(selectedGrade);
  }, [selectedGrade]);

  const curriculumData = useMemo(() => {
    if (!selectedGrade || !selectedSubject) return null;
    const key = `${selectedGrade}-${selectedSubject}`;
    return curriculumMap[key] || null;
  }, [selectedGrade, selectedSubject]);


  const availableStrands = useMemo(() => curriculumData?.strands || [], [curriculumData]);

  const availableSubStrands = useMemo(() => {
    if (selectedStrand) {
      const strand = availableStrands.find((s: any) => s.title === selectedStrand);
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
          type: 'Scheme of Work',
          joinCode: ''
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

    const subStrandData = availableSubStrands.find((ss: any) => ss.title === selectedSubStrandName);
    
    if (!subStrandData) {
        toast({
            variant: "destructive",
            title: "Invalid Selection",
            description: "Please select a valid strand and sub-strand.",
        });
        setLoading(false);
        return;
    }
    
    // Construct the context string by serializing the sub-strand data
    const contextString = Object.entries(subStrandData)
        .map(([key, value]) => `**${key}:**\n${Array.isArray(value) ? value.join('\n- ') : value}`)
        .join('\n\n');

    const data: GenerateSchemeOfWorkInput = {
      subject: selectedSubject,
      grade: selectedGrade,
      strand: selectedStrand,
      subStrand: selectedSubStrandName,
      lessonsPerWeek: subStrandData.lessons || lessonsPerWeek.toString(),
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
      setSelectedGrade('');
      setSelectedSubject('');
      setSelectedStrand('');
      setSelectedSubStrandName('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Schemer: Single Sub-Strand</DialogTitle>
          <DialogDescription>
             Create a one-sub-strand, CBC-compliant Scheme of Work by selecting from official curriculum data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select name="grade" value={selectedGrade} onValueChange={v => { setSelectedGrade(v); setSelectedSubject(''); setSelectedStrand(''); setSelectedSubStrandName(''); }} required>
                            <SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger>
                            <SelectContent>
                                {availableGrades.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select name="subject" value={selectedSubject} onValueChange={v => { setSelectedSubject(v); setSelectedStrand(''); setSelectedSubStrandName(''); }} required disabled={!selectedGrade}>
                           <SelectTrigger><SelectValue placeholder="Select subject..." /></SelectTrigger>
                           <SelectContent>
                                {availableSubjects.map(s => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                           </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="strand">Strand</Label>
                    <Select name="strand" value={selectedStrand} onValueChange={v => { setSelectedStrand(v); setSelectedSubStrandName(''); }} required disabled={!curriculumData}>
                        <SelectTrigger><SelectValue placeholder="Select a strand..." /></SelectTrigger>
                        <SelectContent>
                            {availableStrands.map((s: any) => (
                                <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subStrand">Sub-Strand</Label>
                    <Select name="subStrand" value={selectedSubStrandName} onValueChange={setSelectedSubStrandName} required disabled={!selectedStrand}>
                        <SelectTrigger><SelectValue placeholder="Select a sub-strand..." /></SelectTrigger>
                        <SelectContent>
                            {availableSubStrands.map((ss: any) => (
                                <SelectItem key={ss.title} value={ss.title}>{ss.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div>
                    <Label htmlFor="lessonsPerWeek">Number of Lessons: {lessonsPerWeek}</Label>
                    <Slider id="lessonsPerWeek" name="lessonsPerWeek" min={1} max={15} step={1} value={[lessonsPerWeek]} onValueChange={(value) => setLessonsPerWeek(value[0])} />
                </div>
                
                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={loading || !selectedSubStrandName} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Scheme of Work
                    </Button>
                </DialogFooter>
            </form>
             <div className="border-l border-border pl-8 flex flex-col">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
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
                <div className="flex-grow overflow-auto">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {generatedScheme && (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 overflow-auto border rounded-md p-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScheme}</ReactMarkdown>
                        </div>
                    )}
                     {!loading && !generatedScheme && (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8 bg-muted/50 rounded-lg">
                            <p>Your generated scheme of work will appear here once you fill out the form and click "Generate".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
