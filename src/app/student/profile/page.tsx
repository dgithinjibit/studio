
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data for personalization
const mockUser = {
    fullName: 'Asha Juma',
    email: 'asha.juma@example.com',
    school: 'Moi Nyeri Complex Primary School',
    avatar: 'https://github.com/shadcn.png'
};


export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd save the changes here.
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft />
                        </Button>
                        <CardTitle className="font-headline text-2xl">Your Profile</CardTitle>
                        <div className="w-10"></div> {/* Spacer */}
                    </div>
                    <CardDescription className="text-center pt-2">
                        View and edit your personal information.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={mockUser.avatar} alt={mockUser.fullName} />
                                <AvatarFallback>{mockUser.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <Button variant="outline" size="sm">Change Picture</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" defaultValue={mockUser.fullName} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={mockUser.email} disabled />
                            </div>
                              <div className="space-y-2">
                                <Label htmlFor="school">School</Label>
                                <Input id="school" defaultValue={mockUser.school} />
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
