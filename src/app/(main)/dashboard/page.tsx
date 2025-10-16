
"use client";

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
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
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <TeacherDashboard />
        </Suspense>
    );
}
