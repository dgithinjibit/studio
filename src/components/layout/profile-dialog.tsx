
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

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
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // In a real app, you would handle the file upload here.
            // For now, we'll just log it and show a toast.
            console.log("Selected file:", file.name);
            toast({
                title: "Picture Selected",
                description: `${file.name} is ready to be uploaded.`,
            });
        }
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
                            <div className="relative group">
                                <label htmlFor="picture" className="cursor-pointer">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={mockUser.avatar} alt={mockUser.fullName} />
                                        <AvatarFallback>{mockUser.fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Pencil className="h-8 w-8 text-white" />
                                    </div>
                                </label>
                                <Input 
                                    id="picture" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
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
