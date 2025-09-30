
"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { getTeacherData } from '@/lib/teacher-service';

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

// Dynamically import the TeacherDashboard and prevent it from rendering on the server
const TeacherDashboard = dynamic(
    () => import('@/components/dashboards/teacher-dashboard').then(mod => mod.TeacherDashboard),
    { 
        ssr: false,
        loading: () => <DashboardSkeleton />
    }
);


export default function DashboardPage() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = await getServerUser();
                setRole(user?.role as UserRole);
            } catch (error) {
                console.error("Failed to fetch user role", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (!role) {
       return redirect('/login');
    }

    switch (role) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'school_head':
            return <SchoolHeadDashboard />;
        case 'county_officer':
            return <CountyOfficerDashboard />;
        case 'student':
            return redirect('/student/journey');
        default:
            return redirect('/login');
    }
}
