
"use client";

import { useState, useEffect } from 'react';
import type { TeacherResource, Communication } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { FileText, Trash2, Copy, Calendar, BrainCircuit, BookCopy, GraduationCap, CopySlash, MoreHorizontal, PlusCircle, Search, PlayCircle, ChevronDown, Megaphone, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

export function MyResources() {
    const [allResources, setAllResources] = useState<(TeacherResource & { firestoreId: string })[]>([]);
    const [communications, setCommunications] = useState<(Communication & { firestoreId: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchResources = async () => {
        setLoading(true);
        try {
            const resourcesQuery = query(collection(db, "teacherResources"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(resourcesQuery);
            const resources = querySnapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id })) as (TeacherResource & { firestoreId: string })[];
            setAllResources(resources);
        } catch (error) {
            console.error("Error fetching resources:", error);
            toast({ variant: 'destructive', title: 'Failed to load resources' });
        }
    };
    
    const fetchCommunications = async () => {
        // This can be implemented when communications are moved to Firestore
    };

    useEffect(() => {
        fetchResources();
        fetchCommunications();
        setLoading(false);
        
        const handleResourceUpdate = () => {
            fetchResources();
            fetchCommunications();
        };
        window.addEventListener('resource-update', handleResourceUpdate);
        
        return () => {
            window.removeEventListener('resource-update', handleResourceUpdate);
        };
    }, []);
    
    const learningLabs = allResources.filter(r => r.type === 'AI Tutor Context');
    const otherResources = allResources.filter(r => r.type !== 'AI Tutor Context');

    const handleDelete = async (id: string, url: string, type: 'resource' | 'communication', event: React.MouseEvent) => {
        event.stopPropagation();
        
        try {
            if (type === 'resource') {
                // Delete Firestore document
                await deleteDoc(doc(db, "teacherResources", id));
                
                // Delete file from Storage
                const storageRef = ref(storage, url);
                await deleteObject(storageRef);

                setAllResources(prev => prev.filter(p => p.firestoreId !== id));
            } 
            // Add communication deletion logic here if needed
            
            toast({
                title: "Item Deleted",
                description: "The item has been permanently removed.",
                variant: "destructive"
            });
        } catch (error) {
            console.error("Error deleting resource:", error);
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "The item could not be deleted. Please try again."
            });
        }
    };
    
    const handleCopyUrl = (url: string, event: React.MouseEvent) => {
        event.stopPropagation();
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "URL Copied to Clipboard",
            });
        });
    };
    
    const getIcon = (type: TeacherResource['type']) => {
        switch(type) {
            case 'Lesson Plan': return <FileText className="h-5 w-5 text-blue-500" />;
            case 'Scheme of Work': return <Calendar className="h-5 w-5 text-green-500" />;
            case 'Rubric': return <GraduationCap className="h-5 w-5 text-orange-500" />;
            case 'Worksheet': return <BookCopy className="h-5 w-5 text-purple-500" />;
            case 'Differentiated Worksheet': return <CopySlash className="h-5 w-5 text-indigo-500" />;
            case 'AI Tutor Context': return <BrainCircuit className="h-5 w-5 text-pink-500" />;
            default: return <FileText className="h-5 w-5 text-primary" />;
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

    if (loading) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (allResources.length === 0 && communications.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                <FileText className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">No Items Yet</h3>
                <p className="mt-1 text-sm">
                    Use the "Teacher Tools" or "Learning Lab" to generate resources.
                </p>
                 <Button asChild className="mt-4">
                    <Link href="/dashboard/tools">
                        <PlusCircle className="mr-2" />
                        Create a Resource
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                         <CardTitle className="flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-pink-500" />
                            My Learning Labs
                        </CardTitle>
                        <Button asChild>
                            <Link href="/dashboard/learning-lab">
                                <PlusCircle className="mr-2" />
                                Create Lab
                            </Link>
                        </Button>
                    </div>
                    <CardDescription>
                        Your Learning Labs let you configure AI tools and share them with students so they can explore with purpose and stay on track.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search labs..." className="pl-10" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Filter by status: Active
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Active</DropdownMenuItem>
                                <DropdownMenuItem>Archived</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lab Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {learningLabs.length > 0 ? learningLabs.map(lab => (
                                <TableRow key={lab.firestoreId} className="cursor-pointer" onClick={() => window.location.href = `/dashboard/learning-lab/${lab.firestoreId}`}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback className="bg-pink-50 text-pink-600 font-bold text-xs">{lab.title.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {lab.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="gap-1.5 pl-1.5">
                                            <PlayCircle className="w-4 h-4 text-green-500" />
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell>0</TableCell>
                                    <TableCell>{format(new Date(lab.createdAt), 'PP p')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={(e) => handleDelete(lab.firestoreId, lab.url, 'resource', e)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        You haven't created any Learning Labs yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {otherResources.length > 0 && (
                <div>
                     <h3 className="text-lg font-semibold mb-4 ml-1">Generated Documents</h3>
                     <Accordion type="single" collapsible className="w-full">
                        {otherResources.map((resource) => (
                             <AccordionItem value={resource.firestoreId} key={resource.firestoreId}>
                                <AccordionTrigger className="hover:no-underline px-4">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            {getIcon(resource.type)}
                                            <div>
                                                <p className="font-semibold text-left">{resource.title}</p>
                                                <p className="text-xs text-muted-foreground font-normal">
                                                    Saved {format(new Date(resource.createdAt), 'PP p')}
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
                                            <p>Document stored in the cloud. You can open the file to view its content.</p>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 border-t pt-2 mt-2">
                                            <Button variant="secondary" size="sm" asChild>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer">Open File</a>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={(e) => handleCopyUrl(resource.url, e)}>
                                                <Copy className="mr-2 h-4 w-4"/>
                                                Copy Link
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={(e) => handleDelete(resource.firestoreId, resource.url, 'resource', e)}>
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
             {communications.length > 0 && (
                <div>
                     <h3 className="text-lg font-semibold mb-4 ml-1">Communications Log</h3>
                     <Accordion type="single" collapsible className="w-full">
                        {communications.map((comm) => (
                             <AccordionItem value={comm.id} key={comm.id}>
                                <AccordionTrigger className="hover:no-underline px-4">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <Megaphone className="h-5 w-5 text-destructive" />
                                            <div>
                                                <p className="font-semibold text-left">{comm.title}</p>
                                                <p className="text-xs text-muted-foreground font-normal">
                                                    Sent {format(new Date(comm.date), 'PP p')}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={comm.sender === 'School Head' ? 'destructive' : 'outline'} className="mr-4">
                                            From: {comm.sender}
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="p-4 bg-muted/50 rounded-md">
                                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-pre:bg-transparent prose-pre:p-0">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{comm.content}</ReactMarkdown>
                                        </div>
                                         <div className="text-xs text-muted-foreground pt-2 mt-2 border-t">Recipient: {comm.recipient}</div>
                                        <div className="flex items-center justify-end gap-2 pt-2 mt-2">
                                            <Button variant="destructive" size="sm" onClick={(e) => handleDelete(comm.id, '', 'communication', e)}>
                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </div>
    );
}
