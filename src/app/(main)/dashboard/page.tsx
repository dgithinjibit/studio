
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
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';


export default function TrainingDataPage() {
    const [loading, setLoading] = useState(false);
    const [documentText, setDocumentText] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!documentText.trim()) {
            toast({
                variant: 'destructive',
                title: 'Document text is empty',
                description: 'Please paste the text from your curriculum document.'
            });
            return;
        }

        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const grade = formData.get('grade') as string;
        const subject = formData.get('subject') as string;

        try {
            const result = await ingestCurriculum({ documentText, grade, subject });

            if (result.parsedCurriculum && result.parsedCurriculum.length > 0) {
                // Here, you would typically save this structured data to a database (e.g., Firestore)
                // For this prototype, we'll show a success message.
                
                // Example of saving to Firestore:
                const curriculumCollection = collection(db, "curriculumData");
                await addDoc(curriculumCollection, {
                    grade,
                    subject,
                    createdAt: new Date().toISOString(),
                    content: result.parsedCurriculum,
                });

                toast({
                    title: "Curriculum Ingested!",
                    description: `Successfully parsed and saved ${result.parsedCurriculum.length} item(s) for ${grade} ${subject}.`,
                });
                setDocumentText(""); // Clear the textarea
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
                description: "An unexpected error occurred while the AI was parsing the document."
            });
        } finally {
            setLoading(false);
        }

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline text-3xl">
                    <Database className="w-8 h-8 text-primary" />
                    Curriculum Ingestor
                </CardTitle>
                <CardDescription>
                    This is an admin tool to train the AI. Paste the text content from a curriculum PDF. The AI will parse it and store it in a structured format for other tools to use.
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
                        <Label htmlFor="documentText">Curriculum Document Text</Label>
                        <Textarea 
                            id="documentText"
                            name="documentText"
                            placeholder="Copy and paste the entire text content from one curriculum PDF here. Ensure it includes tables with columns like 'Strand', 'Sub strand', etc."
                            className="h-96 font-mono text-xs"
                            value={documentText}
                            onChange={(e) => setDocumentText(e.target.value)}
                        />
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
    )
}
