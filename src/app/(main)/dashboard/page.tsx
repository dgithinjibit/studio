
import { Suspense } from 'react';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
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

export default async function DashboardPage() {
    const user = await getServerUser();

    if (!user?.role) {
       return redirect('/login');
    }

    switch (user.role) {
        case 'teacher':
            const teacher = await getTeacherData('usr_3');
            return (
                 <Suspense fallback={<DashboardSkeleton />}>
                    <TeacherDashboard initialTeacherData={teacher} />
                </Suspense>
            );
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
