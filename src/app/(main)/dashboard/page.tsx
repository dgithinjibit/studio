"use client";

import { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TeacherDashboard from '@/components/dashboards/teacher-dashboard';
import SchoolHeadDashboard from '@/components/dashboards/school-head-dashboard';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

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
                 // We still verify with server in the background
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

        switch (role) {
            case 'teacher':
                return <TeacherDashboard />;
            case 'school_head':
                return <SchoolHeadDashboard />;
            case 'county_officer':
                return <CountyOfficerDashboard />;
            default:
                return <DashboardSkeleton />;
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

import Link from 'next/link';
import { Button } from '@/components/ui/button';