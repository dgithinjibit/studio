"use client";

import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/hooks/use-role";
import { mockAssignments, mockCurriculumDocs } from "@/lib/mock-data";
import { Eye, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function AssignmentsPage() {
  const { role } = useRole();
  const { toast } = useToast();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Upload Simulated",
        description: "Your assignment has been 'uploaded' successfully.",
    });
  }

  return (
    <>
      <AppHeader title="Assignments" />
      <main className="flex-1 p-4 md:p-6">
        <Tabs defaultValue="submissions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submissions">View Submissions</TabsTrigger>
            <TabsTrigger value="upload">Upload Assignment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Submissions</CardTitle>
                <CardDescription>
                  {role === 'teacher' ? "Review assignments submitted by your students." : "View your submitted assignments."}
                  <br/>
                  <small>Access is controlled by class and student ID using Firebase Security Rules.</small>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Class</TableHead>
                      <TableHead className="hidden sm:table-cell">Submitted At</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssignments
                      .filter(a => role === 'teacher' || (role === 'student' && a.studentId === 'usr_1'))
                      .map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.studentName}</TableCell>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{assignment.className}</TableCell>
                        <TableCell className="hidden sm:table-cell">{format(assignment.submittedAt, "PPp")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <a href={assignment.url}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Assignment</CardTitle>
                <CardDescription>
                  Upload your completed assignment file here. Max file size: 10MB.
                   <br/>
                  <small>Post-upload, a Cloud Function can be triggered for processing, e.g., checking for plagiarism.</small>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockCurriculumDocs.map(doc => (
                                    <SelectItem key={doc.id} value={doc.subject}>{doc.subject}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assignmentFile">Assignment File</Label>
                        <Input id="assignmentFile" type="file" disabled={role !== 'student'} />
                        {role !== 'student' && <p className="text-sm text-destructive">File upload is only enabled for students.</p>}
                    </div>
                    <Button type="submit" disabled={role !== 'student'}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Submit Assignment
                    </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
