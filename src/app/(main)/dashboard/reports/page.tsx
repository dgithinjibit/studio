
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MyResources } from "@/components/my-resources";
import { Library, BarChart2 } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import type { TeacherResource } from "@/lib/types";
import { useRole } from "@/hooks/use-role";

function TeacherResourcesView() {
    const [resources, setResources] = useState<TeacherResource[]>([]);
    
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "teacherResources"), (snapshot) => {
             const resourcesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeacherResource[];
            setResources(resourcesData);
        });

        return () => unsubscribe();
    }, []);

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

export default function ReportsPage() {
    const { role } = useRole();

    if (role === 'school_head') {
        return <SchoolHeadReportsView />;
    }

    // Default to teacher view
    return <TeacherResourcesView />;
}
