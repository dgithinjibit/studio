
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MyResources } from "@/components/my-resources";
import { BarChart2 } from "lucide-react";
import { getServerUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

function TeacherResourcesView() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="font-headline text-3xl font-bold">My Library</h1>
                <p className="text-muted-foreground">All your saved Learning Labs, generated documents, and communications organized for easy access.</p>
            </div>
            <MyResources />
        </div>
    );
}

function SchoolHeadReportsView() {
    return (
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <BarChart2 className="w-6 h-6 text-primary" />
                    School-Wide Reports
                </CardTitle>
                <CardDescription>
                    This dashboard will provide aggregated reports on school performance, attendance trends, and resource utilization.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground p-8">
                    <p>School-wide reporting features are coming soon.</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default async function ReportsPage() {
    const user = await getServerUser();
    const role = user?.role as UserRole;

    if (role === 'school_head') {
        return <SchoolHeadReportsView />;
    }

    // Default to teacher view for teachers and any other role
    return <TeacherResourcesView />;
}
