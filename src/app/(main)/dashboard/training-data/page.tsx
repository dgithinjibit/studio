
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UploadCloud, File, Trash2, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface TrainingFile {
    name: string;
    url: string;
    size: number;
    uploadedAt: string;
}

export default function TrainingDataPage() {
    const [uploadingFiles, setUploadingFiles] = useState<{ file: File, progress: number, id: string }[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<TrainingFile[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchTrainingFiles = async () => {
        setLoading(true);
        try {
            const storageRef = ref(storage, 'training_data/');
            const res = await listAll(storageRef);
            const files = await Promise.all(
                res.items.map(async (itemRef) => {
                    const metadata = await getMetadata(itemRef);
                    const url = await getDownloadURL(itemRef);
                    return {
                        name: metadata.name,
                        url: url,
                        size: metadata.size,
                        uploadedAt: metadata.timeCreated
                    };
                })
            );
            setUploadedFiles(files);
        } catch (error) {
            console.error("Error fetching training files:", error);
            toast({
                variant: 'destructive',
                title: 'Failed to load files',
                description: 'Could not retrieve the list of training documents from storage.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainingFiles();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles.map(file => ({ file, progress: 0, id: `${file.name}-${Date.now()}` }));
        setUploadingFiles(prev => [...prev, ...newFiles]);
        
        newFiles.forEach(fileObj => {
            const storageRef = ref(storage, `training_data/${fileObj.file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, fileObj.file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadingFiles(prev =>
                        prev.map(f => f.id === fileObj.id ? { ...f, progress } : f)
                    );
                },
                (error) => {
                    console.error("Upload error:", error);
                    toast({
                        variant: "destructive",
                        title: `Upload Failed: ${fileObj.file.name}`,
                        description: "Could not upload the file. Please try again.",
                    });
                    setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        toast({
                            title: `Upload Successful: ${fileObj.file.name}`,
                            description: "The file is now available for AI training.",
                        });
                        setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
                        // Refresh the list of files
                        fetchTrainingFiles();
                    });
                }
            );
        });
    }, [toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] }
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">AI Training Data</CardTitle>
                    <CardDescription>
                        Upload your curriculum documents, textbooks, and other materials here. These files will be used to ground the AI, ensuring its responses are accurate and aligned with your educational framework.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        {isDragActive ? (
                            <p className="mt-4 text-primary">Drop the files here ...</p>
                        ) : (
                            <p className="mt-4 text-muted-foreground">Drag & drop your PDF files here, or click to select files</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {uploadingFiles.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Uploading Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {uploadingFiles.map(fileObj => (
                            <div key={fileObj.id} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                                    <p className="text-sm text-muted-foreground">{Math.round(fileObj.progress)}%</p>
                                </div>
                                <Progress value={fileObj.progress} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Documents</CardTitle>
                    <CardDescription>
                        These are the documents currently in your AI's knowledge base.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Uploaded On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {uploadedFiles.length > 0 ? uploadedFiles.map(file => (
                                    <TableRow key={file.name}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <File className="h-4 w-4 text-primary" />
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{file.name}</a>
                                        </TableCell>
                                        <TableCell>{(file.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                                        <TableCell>{format(new Date(file.uploadedAt), 'PP p')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" disabled>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No training documents uploaded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
