
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ingestCurriculum } from '@/ai/flows/ingest-curriculum';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function CurriculumIngestorPage() {
    const [loading, setLoading] = useState(false);
    const [documentText, setDocumentText] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const text = formData.get('documentText') as string;
        const pdfFile = formData.get('pdfFile') as File;

        if (!text.trim()) {
            toast({
                variant: 'destructive',
                title: 'Document text is empty',
                description: 'Please paste the text from your curriculum document.'
            });
            return;
        }

        if (pdfFile.size === 0) {
            toast({
                variant: 'destructive',
                title: 'No PDF selected',
                description: 'Please select the original PDF file for backup.'
            });
            return;
        }

        setLoading(true);

        const grade = formData.get('grade') as string;
        const subject = formData.get('subject') as string;

        try {
            // 1. Upload the original PDF for backup
            const storageRef = ref(storage, `curriculum_pdfs/${pdfFile.name}`);
            await uploadBytes(storageRef, pdfFile);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Process the pasted text with the AI
            const result = await ingestCurriculum({ documentText: text, grade, subject });

            if (result.parsedCurriculum && result.parsedCurriculum.length > 0) {
                
                // 3. Save the structured data AND the backup URL to Firestore
                const curriculumCollection = collection(db, "curriculumData");
                await addDoc(curriculumCollection, {
                    grade,
                    subject,
                    createdAt: new Date().toISOString(),
                    originalFileUrl: downloadURL,
                    content: result.parsedCurriculum,
                });

                toast({
                    title: "Curriculum Ingested!",
                    description: `Successfully parsed and saved ${result.parsedCurriculum.length} item(s) for ${grade} ${subject}. PDF backed up.`,
                });
                setDocumentText(""); // Clear the textarea
                (event.target as HTMLFormElement).reset(); // Clear the form including file input
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'Ingestion Failed',
                    description: 'The AI could not find any structured curriculum data. Please check the pasted text.'
                });
            }
        } catch (error) {
            console.error("Error ingesting curriculum:", error);
            toast({
                variant: "destructive",
                title: "Error During Ingestion",
                description: "An unexpected error occurred while parsing or uploading. Check the console for details."
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
                        Upload the curriculum PDF for backup and paste its text content. The AI will parse the text and store it in a structured format.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">Grade Level</Label>
                                <Select name="grade" required defaultValue="Grade 4">
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
                                <Input id="subject" name="subject" placeholder="e.g., Agriculture and Nutrition" required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="pdfFile">Original PDF Document</Label>
                            <Input id="pdfFile" name="pdfFile" type="file" accept=".pdf" required />
                             <p className="text-sm text-muted-foreground">Select the PDF file to be saved for backup.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documentText">Curriculum Document Text</Label>
                            <Textarea 
                                id="documentText"
                                name="documentText"
                                placeholder="Copy and paste the entire text content from the PDF here. Ensure it includes tables with columns like 'Strand', 'Sub strand', etc."
                                className="h-96 font-mono text-xs"
                                value={documentText}
                                onChange={(e) => setDocumentText(e.target.value)}
                            />
                             <p className="text-sm text-muted-foreground">The AI will read this text to structure the curriculum data.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            {loading ? 'Ingesting and Training...' : 'Ingest Curriculum Data'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
