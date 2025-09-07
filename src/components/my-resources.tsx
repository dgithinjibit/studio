
"use client";

import { useState, useEffect } from 'react';
import type { TeacherResource } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash2, Copy, Calendar, BrainCircuit, BookCopy, GraduationCap, CopySlash, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card } from './ui/card';
import Link from 'next/link';

export function MyResources() {
    const [resources, setResources] = useState<TeacherResource[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const loadResources = () => {
            const storedResources = localStorage.getItem("teacherResources");
            if (storedResources) {
                setResources(JSON.parse(storedResources));
            }
        };
        loadResources();
        
        const handleStorageChange = () => {
            loadResources();
        };

        window.addEventListener('storage', handleStorageChange);
        
        const handleResourceUpdate = () => {
            loadResources();
        };
        window.addEventListener('resource-update', handleResourceUpdate);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('resource-update', handleResourceUpdate);
        };
    }, []);

    const handleDelete = (resourceId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent the click from opening the link/accordion
        const updatedResources = resources.filter(p => p.id !== resourceId);
        setResources(updatedResources);
        localStorage.setItem("teacherResources", JSON.stringify(updatedResources));
        toast({
            title: "Resource Deleted",
            description: "The item has been removed from your resources.",
            variant: "destructive"
        });
    };
    
    const handleCopy = (content: string, event: React.MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard.writeText(content).then(() => {
            toast({
                title: "Copied to Clipboard",
            });
        });
    };
    
    const getIcon = (type: TeacherResource['type']) => {
        switch(type) {
            case 'Lesson Plan':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'Scheme of Work':
                return <Calendar className="h-5 w-5 text-green-500" />;
            case 'Rubric':
                return <GraduationCap className="h-5 w-5 text-orange-500" />;
            case 'Worksheet':
                return <BookCopy className="h-5 w-5 text-purple-500" />;
            case 'Differentiated Worksheet':
                 return <CopySlash className="h-5 w-5 text-indigo-500" />;
            case 'AI Tutor Context':
                return <BrainCircuit className="h-5 w-5 text-pink-500" />;
            default:
                return <FileText className="h-5 w-5 text-primary" />;
        }
    }
    
     const getBadgeVariant = (type: TeacherResource['type']): "secondary" | "outline" | "default" | "destructive" => {
        switch(type) {
            case 'Lesson Plan': return 'default';
            case 'Scheme of Work': return 'secondary';
            case 'AI Tutor Context': return 'destructive';
            case 'Rubric': return 'default';
            case 'Worksheet': return 'secondary';
            case 'Differentiated Worksheet': return 'outline';
            default: return 'outline';
        }
    }

    if (resources.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                <FileText className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Resources Yet</h3>
                <p className="mt-1 text-sm">
                    Use the "Teacher Tools" or "Learning Lab" to generate resources.
                </p>
            </div>
        );
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {resources.map((resource) => {
                if (resource.type === 'AI Tutor Context') {
                    return (
                        <Card key={resource.id} className="mb-2">
                             <Link href={`/dashboard/learning-lab/${resource.id}`} className="block hover:bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        {getIcon(resource.type)}
                                        <div>
                                            <p className="font-semibold text-left">{resource.title}</p>
                                            <p className="text-xs text-muted-foreground font-normal">
                                                Created {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={getBadgeVariant(resource.type)}>
                                            {resource.type}
                                        </Badge>
                                        <Button variant="ghost" size="icon" onClick={(e) => handleDelete(resource.id, e)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    )
                }

                return (
                    <AccordionItem value={resource.id} key={resource.id}>
                        <AccordionTrigger className="hover:no-underline px-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4">
                                     {getIcon(resource.type)}
                                     <div>
                                        <p className="font-semibold text-left">{resource.title}</p>
                                        <p className="text-xs text-muted-foreground font-normal">
                                            Saved {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                                        </p>
                                     </div>
                                </div>
                                <Badge variant={getBadgeVariant(resource.type)} className="mr-4">
                                    {resource.type}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-4 bg-muted/50 rounded-md">
                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:bg-transparent prose-pre:p-0">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{resource.content}</ReactMarkdown>
                                 </div>
                                 <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                                    <Button variant="ghost" size="sm" onClick={(e) => handleCopy(resource.content, e)}>
                                        <Copy className="mr-2 h-4 w-4"/>
                                        Copy
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={(e) => handleDelete(resource.id, e)}>
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Delete
                                    </Button>
                                 </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    );
}
