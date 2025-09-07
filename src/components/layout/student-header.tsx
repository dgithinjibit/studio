
"use client";

import { useState } from 'react';
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
import Link from 'next/link';

interface StudentHeaderProps {
  showBackButton: boolean;
  onBack: () => void;
  studentFirstName: string;
}

export function StudentHeader({ showBackButton, onBack, studentFirstName }: StudentHeaderProps) {
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <>
        <div className="relative flex items-center justify-center py-4">
            {showBackButton && (
                <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2">
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
            )}
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold">Karibu, {studentFirstName}!</h1>
                <p className="text-muted-foreground text-lg mt-2">
                    I’m Mwalimu AI, your friendly Socratic Mentor.
                </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <User className="mr-2" />
                            Profile
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                         <DropdownMenuLabel>My Account</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Profile Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <ProfileDialog open={isProfileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
