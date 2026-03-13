
"use client";

import { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TeacherDashboard from '@/components/dashboards/teacher-dashboard';
import SchoolHeadDashboard from '@/components/dashboards/school-head-dashboard';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import StudentDashboard from '@/components/dashboards/student-dashboard';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const DashboardSkeleton = () => (
    <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-4 mt-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
            <Skeleton className="h-[400px] md:col-span-2 w-full" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    </div>
);

export default function DashboardPage() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
             // 1. Instant fallback to localStorage for immediate UI rendering in demo mode
             const localRole = localStorage.getItem('userRole') as UserRole | null;
             if (localRole) {
                 setRole(localRole);
                 setLoading(false);
             }

             // 2. Authoritative check from Server Action
             const user = await getServerUser();
             if (user?.role) {
                 setRole(user.role as UserRole);
                 localStorage.setItem('userRole', user.role);
             }
             
             setLoading(false);
        }
        fetchRole();
    }, []);

    /**
     * Role-Checking Logic:
     * This function maps the validated user role to its specific dashboard component.
     * It uses an explicit switch statement to ensure NO incorrect fallbacks.
     */
    const renderDashboardByRole = () => {
        if (!role && !loading) {
            return (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
                    <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground mb-6">We couldn't determine your role. Please sign in again.</p>
                    <Button asChild>
                        <Link href="/signup">Back to Role Selection</Link>
                    </Button>
                </div>
            );
        }

        // Routing Logic per Explicit Requirements:
        // - 'student' -> StudentDashboard (Join Code Launchpad)
        // - 'teacher' -> TeacherDashboard (Class/Resource Management)
        // - 'school_head' -> SchoolHeadDashboard (School Analytics/Staff)
        // - 'county_officer' -> CountyOfficerDashboard (County Map Oversight)
        switch (role) {
            case 'student':
                return <StudentDashboard />;
            case 'teacher':
                return <TeacherDashboard />;
            case 'school_head':
                return <SchoolHeadDashboard />;
            case 'county_officer':
                return <CountyOfficerDashboard />;
            default:
                if (loading) return <DashboardSkeleton />;
                return (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-center p-6 border-2 border-dashed rounded-xl bg-muted/20">
                        <h2 className="text-xl font-bold text-destructive mb-2">Error: Invalid user role</h2>
                        <p className="text-muted-foreground">The system could not identify your access level. Please contact support.</p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link href="/signup">Reset Session</Link>
                        </Button>
                    </div>
                );
        }
    };
    
    if (loading && !role) {
        return <DashboardSkeleton />;
    }

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 md:p-0">
                {renderDashboardByRole()}
            </div>
        </Suspense>
    );
}
