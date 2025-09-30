
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, ArrowLeft, LogOut, Settings, Video } from 'lucide-react';
import ProfileDialog from './profile-dialog';
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
  showVideoCallButton?: boolean;
  onJoinVideoCall?: () => void;
}

export function StudentHeader({ showBackButton, onBack, showVideoCallButton = false, onJoinVideoCall }: StudentHeaderProps) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [studentFirstName, setStudentFirstName] = useState('Student');
  const [studentAvatar, setStudentAvatar] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    const avatar = localStorage.getItem('userAvatar');
    if (name) {
        setStudentFirstName(name.split(' ')[0]);
    }
    if (avatar) {
        setStudentAvatar(avatar);
    }
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <>
        <div className="relative flex items-center justify-center py-4 text-foreground">
            {showBackButton && (
                <Button variant="ghost" size="icon" onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted">
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
            )}
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold">Karibu! Welcome!</h1>
                <p className="text-muted-foreground text-lg mt-2">
                    I’m Mwalimu AI, your friendly Socratic Mentor.
                </p>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {showVideoCallButton && (
                    <Button onClick={onJoinVideoCall} className="bg-green-500 hover:bg-green-600">
                        <Video className="mr-2" />
                        Join Video Call
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                         <Button
                            variant="outline"
                            className="flex items-center gap-2 rounded-full h-12 px-4 bg-background/80 border-border text-foreground hover:bg-muted hover:border-border/80"
                          >
                            <Avatar className="h-8 w-8">
                               <AvatarImage src={studentAvatar || undefined} alt="Profile Picture" />
                               <AvatarFallback>{studentFirstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>Profile</span>
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
