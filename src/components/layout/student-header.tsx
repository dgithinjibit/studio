
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ArrowLeft, LogOut, Settings } from 'lucide-react';
import { ProfileDialog } from './profile-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StudentHeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  studentFirstName: string;
}

export function StudentHeader({ showBackButton, onBack, studentFirstName }: StudentHeaderProps) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
        <div className="relative flex items-center justify-center py-4 text-stone-800">
            {showBackButton && (
                <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-800 hover:bg-stone-100">
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
            )}
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold">Karibu, {studentFirstName}!</h1>
                <p className="text-stone-600 text-lg mt-2">
                    I’m Mwalimu AI, your friendly Socratic Mentor.
                </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button
                            variant="ghost"
                            className="relative h-12 w-12 rounded-full"
                          >
                            <Avatar className="h-12 w-12">
                               <AvatarImage src="/assets/prof.png" alt="Profile Picture" />
                               <AvatarFallback>{studentFirstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                         <DropdownMenuLabel>My Account</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                           <LogOut className="mr-2 h-4 w-4" />
                           <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <ProfileDialog open={isProfileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
