
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Copy, Calendar } from "lucide-react";
import { generateSchemeOfWork, GenerateSchemeOfWorkInput } from "@/ai/flows/generate-scheme-of-work";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TeacherResource } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { storage, db } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const grades = [
    "PP1", "PP2", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"
];

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

  const [formData, setFormData] = useState({
    grade: "",
    subject: "",
    strand: "",
    subStrand: "",
    context: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        const fileName = `schemes_of_work/${Date.now()}_${formData.subStrand.replace(/\s+/g, '_')}.md`;
        const storageRef = ref(storage, fileName);
        
        await uploadString(storageRef, generatedScheme, 'raw', { contentType: 'text/markdown' });
        const downloadURL = await getDownloadURL(storageRef);

        const newResource: Omit<TeacherResource, 'id'> = {
          title: `${formData.subStrand} - Scheme of Work`,
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

    const data: GenerateSchemeOfWorkInput = {
      subject: formData.subject,
      grade: formData.grade,
      strand: formData.strand,
      subStrand: formData.subStrand,
      lessonsPerWeek: lessonsPerWeek.toString(),
      schemeOfWorkContext: formData.context, 
    };
    
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
      setFormData({
        grade: "",
        subject: "",
        strand: "",
        subStrand: "",
        context: ""
      });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Calendar className="text-primary" />
            Schemer: CBC Scheme of Work
          </DialogTitle>
          <DialogDescription>
             Fill in the details below to generate a professional, CBC-compliant Scheme of Work.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="grade">Grade Level</Label>
                        <Select name="grade" value={formData.grade} onValueChange={v => setFormData(prev => ({...prev, grade: v}))} required>
                            <SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger>
                            <SelectContent>
                                {grades.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Learning Area / Subject</Label>
                        <Input 
                            id="subject" 
                            name="subject" 
                            placeholder="e.g., Social Studies" 
                            value={formData.subject} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="strand">Strand</Label>
                    <Input 
                        id="strand" 
                        name="strand" 
                        placeholder="e.g., 2.0 People and Social Organisations" 
                        value={formData.strand} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subStrand">Sub-Strand</Label>
                    <Input 
                        id="subStrand" 
                        name="subStrand" 
                        placeholder="e.g., 2.1 Language groups in Eastern Africa" 
                        value={formData.subStrand} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                
                <div className="space-y-4">
                    <Label htmlFor="lessonsPerWeek">Number of Lessons: {lessonsPerWeek}</Label>
                    <Slider id="lessonsPerWeek" name="lessonsPerWeek" min={1} max={15} step={1} value={[lessonsPerWeek]} onValueChange={(value) => setLessonsPerWeek(value[0])} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="context">Curriculum Details / Specific Outcomes (Optional)</Label>
                    <Textarea 
                        id="context" 
                        name="context" 
                        placeholder="Paste specific learning outcomes, suggested activities, or notes from the curriculum document here to guide the AI..." 
                        value={formData.context} 
                        onChange={handleInputChange} 
                        className="h-32"
                    />
                </div>
                
                <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-2">
                    <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Scheme
                    </Button>
                </DialogFooter>
            </form>
             <div className="border-l border-border pl-8 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h3 className="font-bold">Preview:</h3>
                    {generatedScheme && (
                         <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleCopy}>
                                <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                             <Button onClick={handleSave} disabled={loading} size="sm">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4 mr-2" />}
                                Save to Library
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex-grow overflow-auto border rounded-md p-4 bg-muted/30">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {generatedScheme && (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 overflow-auto">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedScheme}</ReactMarkdown>
                        </div>
                    )}
                     {!loading && !generatedScheme && (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8">
                            <p>Your generated scheme of work will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
