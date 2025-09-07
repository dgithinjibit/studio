
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, FlaskConical } from "lucide-react";
import type { TeacherResource } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function LearningLabPage() {
    const [loading, setLoading] = useState(false);
    const [context, setContext] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const onResourceSaved = () => {
        // We need to dispatch a custom event to tell the MyResources component to update
        // because localStorage changes in the same window don't trigger the 'storage' event.
        window.dispatchEvent(new CustomEvent('resource-update'));
        router.push('/dashboard/resources');
    }

    const handleSaveToRoom = () => {
        if (!context.trim()) {
            toast({
                variant: "destructive",
                title: "Content is empty",
                description: "Please provide some content for the Study Bot before saving.",
            });
            return;
        }

        setLoading(true);

        // This ID will be the "code" students use to enter the room.
        const resourceId = `studytour_${Date.now()}`;

        const newResource: TeacherResource = {
          id: resourceId,
          title: `Study Tour - ${new Date().toLocaleString()}`,
          content: context,
          createdAt: new Date().toISOString(),
          type: 'AI Tutor Context'
        };

        const existingResources: TeacherResource[] = JSON.parse(localStorage.getItem("teacherResources") || "[]");
        
        // Save the new context, keeping only the most recent one for simplicity.
        // In a real app, you'd manage multiple rooms.
        const otherResources = existingResources.filter(r => r.type !== 'AI Tutor Context');
        localStorage.setItem("teacherResources", JSON.stringify([newResource, ...otherResources]));
        
        toast({
          title: "Study Bot Room Saved!",
          description: (
            <div className="flex flex-col gap-2">
                <p>Share this code with your students:</p>
                <code className="p-2 bg-muted rounded-md text-sm font-mono">{resourceId}</code>
            </div>
          ),
          duration: 15000,
        });

        setLoading(false);
        onResourceSaved();
  };

  return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-primary" />
                    Learning Lab: Create a Study Bot
                </CardTitle>
                <CardDescription>
                    Create a custom AI study partner for your students. Provide the text, article, or notes you want the bot to use as its only source of knowledge.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="grid w-full gap-1.5">
                    <Label htmlFor="message">Study Bot Knowledge Base</Label>
                    <Textarea 
                        placeholder="Paste your lesson notes, an article, or any text here. The AI will only use this content to answer student questions." 
                        id="message" 
                        className="h-64"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">You can paste up to 75,000 words.</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSaveToRoom} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save to Room & Get Code
                </Button>
            </CardFooter>
        </Card>
  );
}
