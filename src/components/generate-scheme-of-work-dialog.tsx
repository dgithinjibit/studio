
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
import { curriculumStructure } from "@/lib/curriculum-structure";

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
  const [selectedMajorLevel, setSelectedMajorLevel] = useState("");
  const [selectedSubLevel, setSelectedSubLevel] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStrand, setSelectedStrand] = useState("");
  const [selectedSubStrandName, setSelectedSubStrandName] = useState("");


  const availableSubLevels = useMemo(() => {
    if (!selectedMajorLevel) return [];
    return curriculumStructure.find(m => m.name === selectedMajorLevel)?.subLevels || [];
  }, [selectedMajorLevel]);

  const availableGrades = useMemo(() => {
      if (!selectedSubLevel) return [];
      return availableSubLevels.find(s => s.name === selectedSubLevel)?.grades || [];
  }, [selectedSubLevel, availableSubLevels]);

  const availableSubjects = useMemo(() => {
    if (!selectedGrade) return { core: [], optional: [] };
    const gradeData = availableGrades.find(g => g.name === selectedGrade);
    if (!gradeData) return { core: [], optional: [] };

    const coreSubjects = gradeData.subjects.filter(s => s.type === 'Core');
    const optionalSubjects = gradeData.subjects.filter(s => s.type === 'Optional');
    
    return { core: coreSubjects, optional: optionalSubjects };

  }, [selectedGrade, availableGrades]);

 const curriculumData = useMemo(() => {
    // Grade 1
    if (selectedGrade === "Grade 1" && selectedSubject === "Creative Activities") return grade1CreativeActivitiesCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "English Language Activities") return grade1EnglishLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "Indigenous Language Activities") return grade1IndigenousLanguageCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "Kiswahili Language Activities") return grade1KiswahiliLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "Mathematical Activities") return grade1MathematicsActivitiesCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "Christian Religious Education") return grade1CreCurriculum;
    if (selectedGrade === "Grade 1" && selectedSubject === "Environmental Activities") return grade1EnvironmentalActivitiesCurriculum;

    // Grade 2
    if (selectedGrade === "Grade 2" && selectedSubject === "Christian Religious Education") return grade2CreCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "Movement and Creative Activities") return grade2CreativeActivitiesCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "English Language Activities") return grade2EnglishLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "Indigenous Language Activities") return grade2IndigenousLanguageCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "Kiswahili Language Activities") return grade2KiswahiliLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "Environmental Activities") return grade2EnvironmentalActivitiesCurriculum;
    if (selectedGrade === "Grade 2" && selectedSubject === "Mathematical Activities") return grade2MathematicsActivitiesCurriculum;
    
    // Grade 3
    if (selectedGrade === "Grade 3" && selectedSubject === "Christian Religious Education") return grade3CreCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "English Language Activities") return grade3EnglishLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "Environmental Activities") return grade3EnvironmentalActivitiesCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "Kiswahili Language Activities") return grade3KiswahiliLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "Mathematical Activities") return grade3MathematicsActivitiesCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "Movement and Creative Activities") return grade3CreativeActivitiesCurriculum;
    if (selectedGrade === "Grade 3" && selectedSubject === "Indigenous Language Activities") return grade3IndigenousLanguageCurriculum;

    // Grade 4
    if (selectedGrade === "Grade 4" && selectedSubject === "Agriculture and Nutrition") return grade4AgricultureAndNutritionCurriculum;
    if (selectedGrade === "Grade 4" && selectedSubject === "Christian Religious Education") return grade4CreCurriculum;
    if (selectedGrade === "Grade 4" && selectedSubject === "Creative Arts") return grade4CreativeArtsCurriculum;
    if (selectedGrade === "Grade 4" && selectedSubject === "English") return grade4EnglishLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 4" && selectedSubject === "Kiswahili") return grade4KiswahiliLanguageActivitiesCurriculum;
    if (selectedGrade === "Grade 4" && selectedSubject === "Indigenous Languages") return grade4IndigenousLanguageCurriculum;


    // Grade 6
    if (selectedGrade === "Grade 6" && selectedSubject === "Social Studies") return grade6SocialStudiesCurriculum;
    
    // PP1
    if (selectedGrade === "PP1" && selectedSubject === "Christian Religious Education") return pp1CreCurriculum;
    if (selectedGrade === "PP1" && selectedSubject === "Creative Activities") return pp1CreativeArtsCurriculum;
    if (selectedGrade === "PP1" && selectedSubject === "Environmental Activities") return pp1EnvironmentalActivitiesCurriculum;
    if (selectedGrade === "PP1" && selectedSubject === "Language Activities") return pp1LanguageActivitiesCurriculum;
    if (selectedGrade === "PP1" && selectedSubject === "Mathematical Activities") return pp1MathematicsActivitiesCurriculum;
    
    // PP2
    if (selectedGrade === "PP2" && selectedSubject === "Christian Religious Education") return pp2CreCurriculum;
    if (selectedGrade === "PP2" && selectedSubject === "Creative Activities") return pp2CreativeArtsCurriculum;
    if (selectedGrade === "PP2" && selectedSubject === "Environmental Activities") return pp2EnvironmentalActivitiesCurriculum;
    if (selectedGrade === "PP2" && selectedSubject === "Language Activities") return pp2LanguageActivitiesCurriculum;
    if (selectedGrade === "PP2" && selectedSubject === "Mathematical Activities") return pp2MathematicsActivitiesCurriculum;
    
    return null;
  }, [selectedGrade, selectedSubject]);

  const availableStrands = useMemo(() => curriculumData?.strands || [], [curriculumData]);

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
    const subStrandData = availableSubStrands.find(ss => ss.title === selectedSubStrandName);
    
    if (!subStrandData) {
        toast({
            variant: "destructive",
            title: "Invalid Selection",
            description: "Please select a valid strand and sub-strand.",
        });
        setLoading(false);
        return;
    }
    
    const contextString = `
        Learning Outcomes: ${subStrandData.learning_outcomes.join('; ')}
        Suggested Activities: ${subStrandData.suggested_activities.join('; ')}
        Key Inquiry Question: ${subStrandData.key_inquiry_questions.join('; ')}
    `;

    const data: GenerateSchemeOfWorkInput = {
      subject: selectedSubject,
      grade: selectedGrade,
      subStrand: selectedSubStrandName,
      availableResources: formData.get("availableResources") as string,
      numberOfWeeks: "1",
      lessonsPerWeek: lessonsPerWeek.toString(),
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
      setSelectedMajorLevel('');
      setSelectedSubLevel('');
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Schemer: Week Generator</DialogTitle>
          <DialogDescription>
             Create a one-week, CBC-compliant Scheme of Work by selecting from official curriculum data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>Major Level</Label>
                      <Select name="majorLevel" value={selectedMajorLevel} onValueChange={v => { setSelectedMajorLevel(v); setSelectedSubLevel(''); setSelectedGrade(''); setSelectedSubject(''); setSelectedStrand(''); setSelectedSubStrandName(''); }} required>
                          <SelectTrigger><SelectValue placeholder="Select level..." /></SelectTrigger>
                          <SelectContent>
                              {curriculumStructure.map(level => (
                                  <SelectItem key={level.name} value={level.name}>{level.name}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label>Sub-Level</Label>
                      <Select name="subLevel" value={selectedSubLevel} onValueChange={v => { setSelectedSubLevel(v); setSelectedGrade(''); setSelectedSubject(''); setSelectedStrand(''); setSelectedSubStrandName(''); }} required disabled={!selectedMajorLevel}>
                          <SelectTrigger><SelectValue placeholder="Select sub-level..." /></SelectTrigger>
                          <SelectContent>
                              {availableSubLevels.map(level => (
                                  <SelectItem key={level.name} value={level.name}>{level.name}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select name="grade" value={selectedGrade} onValueChange={v => { setSelectedGrade(v); setSelectedSubject(''); setSelectedStrand(''); setSelectedSubStrandName(''); }} required disabled={!selectedSubLevel}>
                            <SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger>
                            <SelectContent>
                                {availableGrades.map(g => (
                                    <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select name="subject" value={selectedSubject} onValueChange={v => { setSelectedSubject(v); setSelectedStrand(''); setSelectedSubStrandName(''); }} required disabled={!selectedGrade}>
                           <SelectTrigger><SelectValue placeholder="Select subject..." /></SelectTrigger>
                           <SelectContent>
                                {availableSubjects && availableSubjects.core.map(s => (
                                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
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
                            {availableStrands.map(s => (
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
                    <Textarea id="availableResources" name="availableResources" defaultValue="Learner's Book, Digital Devices, Pictures" />
                </div>
                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={loading || !selectedSubStrandName} className="w-full">
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
                        <p>Your generated scheme of work will appear here once you fill out the form and click "Generate".</p>
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    

    