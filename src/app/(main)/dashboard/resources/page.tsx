
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MyResources } from "@/components/my-resources";
import { Library } from "lucide-react";

export default function MyResourcesPage() {

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Library className="w-6 h-6 text-accent" />
                    My Resources
                </CardTitle>
                <CardDescription>
                    All your saved lesson plans and schemes of work, organized for easy access.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <MyResources />
            </CardContent>
        </Card>
    );
}
