
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/types";

type RoleCardProps = {
    role: UserRole;
    title: string;
    description: string;
    buttonText: string;
    isLoading: boolean;
    disabled: boolean;
    onClick: (role: UserRole) => void;
};

const RoleCard = ({ role, title, description, buttonText, isLoading, disabled, onClick }: RoleCardProps) => (
    <Card 
        className={`text-center p-6 transition-all h-full flex flex-col justify-between ${disabled && !isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:border-primary cursor-pointer'}`}
        onClick={() => !disabled && onClick(role)}
    >
        <div>
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" className="mt-4 w-full" disabled={disabled}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    {buttonText} <ArrowRight className="ml-2" />
                </>
            )}
        </Button>
    </Card>
);


export default function SignupPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setLoadingRole(role);
    router.push(`/signup/form?role=${role}`);
  };

  const roles: Omit<RoleCardProps, 'isLoading' | 'disabled' | 'onClick'>[] = [
    { role: 'student', title: "I'm a Student", description: "I want to learn, get help with homework, and chat with an AI tutor.", buttonText: "Start Learning" },
    { role: 'teacher', title: "I'm a Teacher", description: "I want to create lesson plans, manage classes, and access resources.", buttonText: "Get Started" },
    { role: 'school_head', title: "I'm a School Head", description: "I manage a school and need to track teacher and student progress.", buttonText: "Manage School" },
    { role: 'county_officer', title: "I'm a County Officer", description: "I oversee schools in a county and need to view performance data.", buttonText: "View Reports" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">To begin, who are you?</CardTitle>
                <CardDescription className="text-center text-lg">
                    Please select your role to personalize your journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((roleInfo) => (
                    <RoleCard
                        key={roleInfo.role}
                        {...roleInfo}
                        isLoading={loadingRole === roleInfo.role}
                        disabled={loadingRole !== null && loadingRole !== roleInfo.role}
                        onClick={handleRoleSelect}
                    />
                ))}
            </CardContent>
             <CardContent className="text-center text-sm text-muted-foreground">
                <p>
                    Already have an account?{' '}
                    <Link href="/login" className="underline font-medium hover:text-primary">
                        Sign In
                    </Link>
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
