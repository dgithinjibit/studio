"use client";

import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { mockReports } from "@/lib/mock-data";
import { FileSearch, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const { role } = useRole();

  const filteredReports = mockReports.filter(report => report.generatedFor.includes(role));

  return (
    <>
      <AppHeader title="AI-Generated Reports" />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">Your Reports</h1>
            <p className="text-muted-foreground">
                Displaying reports available for the '{role.replace('_', ' ')}' role. Access is secured by backend rules.
            </p>
        </div>

        {filteredReports.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredReports.map(report => (
                    <Card key={report.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-start gap-3">
                                <FileSearch className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                                <span>{report.title}</span>
                            </CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{format(report.createdAt, "PPP")}</span>
                            </div>
                            <Button variant="outline">View Report</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 min-h-[400px]">
                <FileSearch className="w-16 h-16 text-muted-foreground mb-4"/>
                <h2 className="text-2xl font-bold tracking-tight">No Reports Available</h2>
                <p className="text-muted-foreground">There are no reports generated for the '{role}' role at this time.</p>
            </div>
        )}
      </main>
    </>
  );
}
