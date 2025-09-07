
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Mock user data for personalization
const mockUser = {
    fullName: 'Asha Juma',
    email: 'asha.juma@example.com',
    school: 'Moi Nyeri Complex Primary School',
    avatar: 'https://github.com/shadcn.png'
};


export function ProfileDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd save the changes here.
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
        onOpenChange(false); // Close dialog on save
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-center">Your Profile</DialogTitle>
                    <DialogDescription className="text-center">
                        View and edit your personal information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div className="flex flex-col items-center space-y-4">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src={mockUser.avatar} alt={mockUser.fullName} />
                                <AvatarFallback>{mockUser.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <Button variant="outline" size="sm" type="button">Change Picture</Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 px-4">
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
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
