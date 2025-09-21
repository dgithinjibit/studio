
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle, Bot, FlaskConical, Share2, Eye, UserCog, Banknote, Megaphone } from 'lucide-react';
import { getServerUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

function TeacherGuide() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <HelpCircle className="w-8 h-8 text-primary" />
            SyncSenta Guide
          </CardTitle>
          <CardDescription>
            Your quick start guide to using the powerful AI tools at your fingertips. Keep it simple!
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot />
                1. Generating Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Navigate to the <strong>Teacher Tools</strong> page from the sidebar.
            </p>
            <p>
              Here you can instantly create high-quality, CBE-aligned resources like Lesson Plans, Schemes of Work, Worksheets, and Rubrics.
            </p>
            <p>
              Just fill in the details, and let the AI do the heavy lifting! You can save any generated resource to <strong>My Library</strong>.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FlaskConical />
                2. Creating a Study Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Go to the <strong>Learning Lab</strong> in the sidebar. This is where you create custom AI tutors for your students.
            </p>
            <p>
              Paste any text—your lesson notes, an article, a story—into the box. The AI will *only* use this text to answer student questions.
            </p>
             <p>Click <strong>"Save to Room"</strong>. This creates a private learning environment for your students.</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Share2 />
                3. Sharing with Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              After you save a room in the Learning Lab, a "Share Room" box will appear.
            </p>
            <p>
              This box contains a unique <strong>Join Code</strong>.
            </p>
            <p>
              Give this code to your students. When they log in, they can enter this code to join your custom Study Bot session.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Eye />
                4. Viewing Student Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Go to the <strong>My Library</strong> page.
            </p>
            <p>
                Click on any "Study Bot Room" you've created.
            </p>
            <p>
              This will take you to the management dashboard for that room where you can see student activity and insights (feature coming soon).
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SchoolHeadGuide() {
    return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-headline text-3xl">
            <HelpCircle className="w-8 h-8 text-primary" />
            SyncSenta Guide
          </CardTitle>
          <CardDescription>
            A quick guide to your dashboard's key strategic and operational tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Bot />
                1. AI Operational Consultant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
                Your main dashboard features the <strong>AI Operational Consultant</strong>. This is your strategic partner.
            </p>
            <p>
              Ask it high-level questions like "Which class needs more resources?" or "Where should I focus teacher training?"
            </p>
            <p>
              The AI will analyze your school's data (class performance, resource allocation) to provide a data-driven recommendation.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserCog />
                2. Staff Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
                From the sidebar, navigate to <strong>Staff Management</strong>.
            </p>
            <p>
              Here, you can maintain a complete record of both teaching and non-teaching staff. Use the tabs to switch between categories.
            </p>
             <p>Click <strong>"Add New Teacher"</strong> or <strong>"Add New Member"</strong> to easily expand your staff list.</p>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Banknote />
                3. School Finance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              The <strong>School Finance</strong> page allows you to track all income and expenditures.
            </p>
            <p>
                Click <strong>"Add New Transaction"</strong> to log expenses for materials, salaries, events, and more.
            </p>
            <p>
              Transactions requiring county-level approval will be flagged automatically, keeping your records compliant.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Megaphone />
                4. Sending Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <p>
              Need to communicate with your whole school? Go to the <strong>School Reports</strong> page.
            </p>
            <p>
                From there, you can send school-wide announcements that will appear in every teacher's "Communications Log" in their library.
            </p>
            <p>
                This is a quick way to disseminate important information to all staff.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


export default async function GuidePage() {
    const user = await getServerUser();
    const role = user?.role as UserRole;

    return (
        <div className="space-y-6">
            {role === 'school_head' ? <SchoolHeadGuide /> : <TeacherGuide />}
        </div>
    );
}
