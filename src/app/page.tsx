
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ingestCurriculum } from '@/ai/flows/ingest-curriculum';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { curriculumStructure } from '@/lib/curriculum-structure';

export default function CurriculumIngestorPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // State for the multi-step form
    const [selectedMajorLevel, setSelectedMajorLevel] = useState('');
    const [selectedSubLevel, setSelectedSubLevel] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const pdfFile = formData.get('pdfFile') as File | null;
        
        if (!pdfFile) {
            toast({
                variant: 'destructive',
                title: 'No PDF selected',
                description: 'Please select a curriculum PDF file.'
            });
            return;
        }

        setLoading(true);

        try {
            // 1. Upload the original PDF for backup
            const storageRef = ref(storage, `curriculum_pdfs/${selectedGrade}/${selectedSubject}/${pdfFile.name}`);
            const uploadSnapshot = await uploadBytes(storageRef, pdfFile);
            const downloadURL = await getDownloadURL(uploadSnapshot.ref);

            // 2. Ingest the curriculum content (text extraction from PDF is a future step)
            // For now, we proceed with the upload and data structure saving.
            const documentText = ""; // This will be replaced by PDF text extraction logic in the future.
            
            const result = await ingestCurriculum({ 
                documentText, 
                grade: selectedGrade, 
                subject: selectedSubject,
                majorLevel: selectedMajorLevel,
                subLevel: selectedSubLevel
            });

            // 3. Save the structured data and a link to the original file
            const curriculumCollection = collection(db, "curriculumData");
            await addDoc(curriculumCollection, {
                majorLevel: selectedMajorLevel,
                subLevel: selectedSubLevel,
                grade: selectedGrade,
                subject: selectedSubject,
                createdAt: new Date().toISOString(),
                originalFileUrl: downloadURL,
                content: result.parsedCurriculum || [], // Save parsed content or an empty array
            });

            toast({
                title: "Curriculum Ingested!",
                description: `Successfully uploaded and processed ${selectedGrade} ${selectedSubject}.`,
            });
            
            // Reset form
            (event.target as HTMLFormElement).reset();
            setSelectedMajorLevel('');
            setSelectedSubLevel('');
            setSelectedGrade('');
            setSelectedSubject('');

        } catch (error) {
            console.error("Error ingesting curriculum:", error);
            toast({
                variant: "destructive",
                title: "Error During Ingestion",
                description: "An unexpected error occurred. Check the console for details."
            });
        } finally {
            setLoading(false);
        }
    }
    
    // Memoized selectors for dependent dropdowns
    const availableSubLevels = useMemo(() => {
        if (!selectedMajorLevel) return [];
        return curriculumStructure.find(m => m.name === selectedMajorLevel)?.subLevels || [];
    }, [selectedMajorLevel]);

    const availableGrades = useMemo(() => {
        if (!selectedSubLevel) return [];
        return availableSubLevels.find(s => s.name === selectedSubLevel)?.grades || [];
    }, [selectedSubLevel, availableSubLevels]);

    const availableSubjects = useMemo(() => {
        if (!selectedGrade) return [];
        return availableGrades.find(g => g.name === selectedGrade)?.subjects || [];
    }, [selectedGrade, availableGrades]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-3xl">
                        <Database className="w-8 h-8 text-primary" />
                        Curriculum Ingestor
                    </CardTitle>
                    <CardDescription>
                       Follow these steps to upload curriculum documents. The AI will process them and store them in a structured format for other tools to use.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            {/* Step 1: Major Level */}
                            <div className="space-y-2">
                                <Label htmlFor="majorLevel">1. Select Major Level</Label>
                                <Select name="majorLevel" required value={selectedMajorLevel} onValueChange={v => { setSelectedMajorLevel(v); setSelectedSubLevel(''); setSelectedGrade(''); setSelectedSubject(''); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an education level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {curriculumStructure.map(level => (
                                            <SelectItem key={level.name} value={level.name}>{level.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Step 2: Sub Level */}
                            {selectedMajorLevel && (
                                <div className="space-y-2">
                                    <Label htmlFor="subLevel">2. Select Sub-Level</Label>
                                    <Select name="subLevel" required value={selectedSubLevel} onValueChange={v => { setSelectedSubLevel(v); setSelectedGrade(''); setSelectedSubject(''); }}>
                                        <SelectTrigger disabled={!availableSubLevels.length}>
                                            <SelectValue placeholder="Select a sub-level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSubLevels.map(level => (
                                                <SelectItem key={level.name} value={level.name}>{level.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                             {/* Step 3: Grade */}
                            {selectedSubLevel && (
                                <div className="space-y-2">
                                    <Label htmlFor="grade">3. Select Grade</Label>
                                    <Select name="grade" required value={selectedGrade} onValueChange={v => { setSelectedGrade(v); setSelectedSubject(''); }}>
                                        <SelectTrigger disabled={!availableGrades.length}>
                                            <SelectValue placeholder="Select a grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableGrades.map(grade => (
                                                <SelectItem key={grade.name} value={grade.name}>{grade.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {/* Step 4: Subject */}
                            {selectedGrade && (
                                <div className="space-y-2">
                                    <Label htmlFor="subject">4. Select Subject</Label>
                                    <Select name="subject" required value={selectedSubject} onValueChange={setSelectedSubject}>
                                        <SelectTrigger disabled={!availableSubjects.length}>
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSubjects.map(subject => (
                                                <SelectItem key={subject.name} value={subject.name}>{subject.name} ({subject.type})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                         <div className="space-y-2 pt-4">
                            <Label htmlFor="pdfFile">5. Upload Curriculum PDF</Label>
                            <Input id="pdfFile" name="pdfFile" type="file" accept=".pdf" required />
                             <p className="text-sm text-muted-foreground">Select the official PDF document for the chosen grade and subject.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading || !selectedSubject} className="w-full md:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            {loading ? 'Ingesting...' : 'Ingest Curriculum Data'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
