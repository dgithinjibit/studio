
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle, Bot, LayoutDashboard, Briefcase, Library } from 'lucide-react';

export default function SchoolHeadGuidePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <HelpCircle className="w-8 h-8 text-primary" />
            SyncSenta School Head Guide
          </CardTitle>
          <CardDescription>
            Your quick start guide to using the school administration and analytics tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LayoutDashboard />
                1. The Dashboard View
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Your main dashboard provides an instant, high-level overview of your school's key metrics.
            </p>
            <p>
              Track <strong>Total Students</strong>, <strong>Student-Teacher Ratio</strong>, and <strong>Average Attendance</strong> at a glance to monitor school health.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot />
                2. AI Operational Consultant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              This is your strategic AI partner. Ask complex questions about your school's data to get data-driven insights.
            </p>
            <p>
              For example, ask: <strong>"Which classes are under-resourced for science?"</strong> or <strong>"What is the correlation between attendance and performance in Form 2?"</strong>
            </p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Briefcase />
                3. Managing Staff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Navigate to the <strong>Staff</strong> page from the sidebar to see a full list of your teachers and staff members.
            </p>
            <p>
                You can add new teachers, view their assigned classes, and see their average performance metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Library />
                4. The School Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              The <strong>My Library</strong> page is the central hub for ALL documents and communications within your school.
            </p>
            <p>
                Here you can review every Lesson Plan, Worksheet, Rubric, and Learning Lab created by your teachers. You can also view all official communications and reports.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
