
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, ArrowLeft } from 'lucide-react';
import { ProfileDialog } from './profile-dialog';

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
            <Button variant="outline" onClick={() => setProfileOpen(true)} className="absolute right-0 top-1/2 -translate-y-1/2">
                <User className="mr-2" />
                Profile
            </Button>
        </div>
        <ProfileDialog open={isProfileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
