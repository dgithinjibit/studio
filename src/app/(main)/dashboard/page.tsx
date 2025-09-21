
import { getServerUser } from '@/lib/auth';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

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


export default async function DashboardPage() {
    const user = await getServerUser();

    if (!user || !user.role) {
        return <DashboardSkeleton />;
    }

    switch (user.role) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'school_head':
            return <SchoolHeadDashboard />;
        case 'county_officer':
            return <CountyOfficerDashboard />;
        default:
            // This is a safe fallback for any unexpected roles
            // For example, if a student somehow lands here.
            return <DashboardSkeleton />;
    }
}
