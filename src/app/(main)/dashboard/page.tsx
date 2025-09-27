
import { getServerUser } from '@/lib/auth';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';

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

    if (!user || !user.role) {
       // If the role can't be determined server-side (e.g., cookie not set yet),
       // it's safer to redirect to login. The signup flow ensures the cookie is set
       // before a hard navigation to this page.
       return redirect('/login');
    }

    switch (user.role) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'school_head':
            return <SchoolHeadDashboard />;
        case 'county_officer':
            return <CountyOfficerDashboard />;
        case 'student':
            // Students should not be on this dashboard. Redirect them to their journey.
            return redirect('/student/journey');
        default:
             // For any other roles or undefined states.
            return redirect('/login');
    }
}
