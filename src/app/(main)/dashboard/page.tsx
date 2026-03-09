
"use client";

import { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TeacherDashboard from '@/components/dashboards/teacher-dashboard';
import SchoolHeadDashboard from '@/components/dashboards/school-head-dashboard';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
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
             // 1. Try to get role from Server Action (Cookie/Auth)
             const user = await getServerUser();
             
             if (user?.role) {
                 setRole(user.role as UserRole);
                 setLoading(false);
                 return;
             }

             // 2. Fallback to localStorage for instant Demo Mode access
             const localRole = localStorage.getItem('userRole') as UserRole | null;
             if (localRole) {
                 setRole(localRole);
             }
             
             setLoading(false);
        }
        fetchRole();
    }, []);

    const renderDashboardByRole = () => {
        switch (role) {
            case 'teacher':
                return <TeacherDashboard />;
            case 'school_head':
                return <SchoolHeadDashboard />;
            case 'county_officer':
                return <CountyOfficerDashboard />;
            default:
                // If role is still null after loading, show a message or redirect
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                        <p className="text-muted-foreground mb-4">We couldn't determine your role. Please sign in again.</p>
                        <a href="/signup" className="text-primary underline">Go to Role Selection</a>
                    </div>
                );
        }
    };
    
    if (loading) {
        return <div className="p-6"><DashboardSkeleton /></div>;
    }

    return (
        <Suspense fallback={<div className="p-6"><DashboardSkeleton /></div>}>
            <div className="animate-in fade-in duration-500">
                {renderDashboardByRole()}
            </div>
        </Suspense>
    );
}
