
"use client";

import { Suspense, useState, useEffect } from 'react';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
            <Skeleton className="h-[350px] w-full" />
        </div>
    </div>
);

export default function DashboardPage() {
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    console.log("the role: ", userRole)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getServerUser();
                if (user?.role) {
                    setUserRole(user.role);
                } else {
                    redirect('/login');
                }
            } catch (error) {
                 console.error("Failed to fetch user", error);
                 redirect('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!userRole) {
       return null; // Or a redirect, but fetching should handle it
    }

    switch (userRole) {
        case 'teacher':
            return (
                 <Suspense fallback={<DashboardSkeleton />}>
                    <TeacherDashboard />
                </Suspense>
            );
        case 'school_head':
            return <SchoolHeadDashboard />;
        case 'county_officer':
            return <CountyOfficerDashboard />;
        case 'student':
            redirect('/student/journey');
            return null;
        default:
            redirect('/login');
            return null;
    }
}
