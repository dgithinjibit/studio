import { AppHeader } from "@/components/layout/app-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, BookCopy } from "lucide-react";
import { mockCurriculumDocs } from "@/lib/mock-data";

export default function CurriculumPage() {
  return (
    <>
      <AppHeader title="Curriculum Resources" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookCopy className="w-6 h-6 text-primary" />
              Official Curriculum Documents
            </CardTitle>
            <CardDescription>
              Securely stored curriculum PDFs. Access is restricted to users with the 'teacher' role via Firebase Storage Security Rules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Subject</TableHead>
                  <TableHead className="hidden md:table-cell">Grade</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCurriculumDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">{doc.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{doc.grade}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} download>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
