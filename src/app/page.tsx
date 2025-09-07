
"use client";

import { useState } from 'react';
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

const grade9Subjects = [
    "Social Studies",
    "Pre-Technical Studies",
    "Mathematics",
    "Kiswahili",
    "Integrated Science",
    "English",
    "CRE",
    "Agriculture and Nutrition",
    "Creative Arts and Sports",
];

export default function CurriculumIngestorPage() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const pdfFiles = (formData.get('pdfFiles') as FileList);
        const documentText = ""; // This is now empty, will be replaced by PDF extraction later.

        if (pdfFiles.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No PDFs selected',
                description: 'Please select the original PDF file(s) for backup.'
            });
            return;
        }

        // For now, we show a message that the text is needed.
        // This will be removed once PDF parsing is implemented.
         toast({
            variant: 'destructive',
            title: 'Feature Under Development',
            description: 'Automatic text extraction from PDFs is not yet available. Please use the text pasting method for now.'
        });
        return;


        setLoading(true);

        const grade = formData.get('grade') as string;
        const subject = formData.get('subject') as string;

        try {
            // 1. Upload all the original PDFs for backup
            const uploadPromises = Array.from(pdfFiles).map(file => {
                const storageRef = ref(storage, `curriculum_pdfs/${file.name}`);
                return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
            });
            
            const downloadURLs = await Promise.all(uploadPromises);

            // 2. Process the text with the AI
            const result = await ingestCurriculum({ documentText, grade, subject });

            if (result.parsedCurriculum && result.parsedCurriculum.length > 0) {
                
                // 3. Save the structured data AND the backup URLs to Firestore
                const curriculumCollection = collection(db, "curriculumData");
                await addDoc(curriculumCollection, {
                    grade,
                    subject,
                    createdAt: new Date().toISOString(),
                    originalFileUrls: downloadURLs, // Save all URLs
                    content: result.parsedCurriculum,
                });

                toast({
                    title: "Curriculum Ingested!",
                    description: `Successfully parsed ${result.parsedCurriculum.length} item(s) for ${grade} ${subject}. ${downloadURLs.length} PDF(s) backed up.`,
                });
                (event.target as HTMLFormElement).reset();
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Ingestion Failed',
                    description: 'The AI could not find any structured curriculum data. Please check the document.'
                });
            }
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-3xl">
                        <Database className="w-8 h-8 text-primary" />
                        Curriculum Ingestor
                    </CardTitle>
                    <CardDescription>
                        Upload your curriculum PDF documents. The AI will process them and store them in a structured format for other tools to use.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">Grade Level</Label>
                                <Select name="grade" required defaultValue="Grade 9">
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
                                <Select name="subject" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {grade9Subjects.map(subject => (
                                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="pdfFiles">Curriculum PDF Document(s)</Label>
                            <Input id="pdfFiles" name="pdfFiles" type="file" accept=".pdf" required multiple />
                             <p className="text-sm text-muted-foreground">Select one or more PDF files. The AI will process them to structure the curriculum data.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            {loading ? 'Ingesting...' : 'Ingest Curriculum Data'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
