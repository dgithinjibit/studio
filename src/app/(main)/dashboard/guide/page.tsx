
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle, Bot, FlaskConical, Share2, Eye } from 'lucide-react';

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

export default function GuidePage() {
    return (
        <div className="space-y-6">
            <TeacherGuide />
        </div>
    );
}
