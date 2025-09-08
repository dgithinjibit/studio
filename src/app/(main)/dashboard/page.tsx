
"use client";

import { useState, useEffect } from 'react';
import type { Teacher } from '@/lib/types';
import { mockTeacher } from '@/lib/mock-data';
import { useRole } from '@/hooks/use-role';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherDashboard = dynamic(() => 
    import('@/components/dashboards/teacher-dashboard').then(mod => mod.TeacherDashboard),
    { 
        ssr: false,
        loading: () => <DashboardSkeleton /> 
    }
);

const SchoolHeadDashboard = dynamic(() =>
    import('@/components/dashboards/school-head-dashboard').then(mod => mod.SchoolHeadDashboard),
    {
        ssr: false,
        loading: () => <DashboardSkeleton />
    }
);

const CountyOfficerDashboard = dynamic(() =>
    import('@/components/dashboards/county-officer-dashboard').then(mod => mod.CountyOfficerDashboard),
    {
        ssr: false,
        loading: () => <DashboardSkeleton />
    }
);


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
            <div className="lg:col-span-2">
                <Skeleton className="h-[350px] w-full" />
            </div>
            <div className="lg:col-span-1">
                <Skeleton className="h-[350px] w-full" />
            </div>
        </div>
    </div>
);


export default function DashboardPage() {
    // For now, we will default to the teacher dashboard for a streamlined experience.
    // The role-based logic can be re-introduced later.
    return <TeacherDashboard teacher={mockTeacher} />;
}
