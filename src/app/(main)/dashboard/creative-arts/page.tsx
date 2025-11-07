
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { List, ListChecks, Music, Target, Shirt, Upload, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const MusicCompositionModule = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2"><Music className="text-primary"/> Music Composition</CardTitle>
      <CardDescription>Compose a 4-bar melody and a 2-bar answering phrase in G Major.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2 flex items-center gap-2"><ListChecks /> Learning Outcomes</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Identify methods of creating a melody.</li>
          <li>Compose a 4-bar question phrase.</li>
          <li>Compose a 2-bar answering phrase.</li>
        </ul>
      </div>
      <div className="p-4 border rounded-lg">
        <h4 className="font-semibold mb-2">Melody Composer</h4>
        <div className="grid grid-cols-8 gap-1 bg-muted/50 p-2 rounded-md h-32">
          {/* Placeholder for a musical staff/grid editor */}
          <div className="border border-dashed flex items-center justify-center text-muted-foreground text-xs col-span-8">Interactive Note Editor Area</div>
        </div>
        <div className="mt-4 flex gap-2">
            <Button>Suggest Melody (AI)</Button>
            <Button variant="outline">Suggest Answering Phrase (AI)</Button>
        </div>
      </div>
       <div>
        <h3 className="font-semibold mb-2 flex items-center gap-2"><List /> Learning Resources</h3>
        <div className="flex gap-2">
            <Button variant="secondary">Download Sheet Music</Button>
            <Button variant="secondary"><PlayCircle className="mr-2"/> Watch Pitch Pipe Tutorial</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NetballSkillsModule = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2"><Target className="text-primary"/> Netball Skills Tracker: Overhead Pass</CardTitle>
      <CardDescription>Learn and master the overhead pass by breaking it down into phases.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2">Skill Breakdown & Progress</h3>
             <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Phase 1: Stance</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2 text-muted-foreground">Stand with feet shoulder-width apart, knees slightly bent, and body balanced.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Phase 2: Grip</AccordionTrigger>
                <AccordionContent>
                    <p className="mb-2 text-muted-foreground">Hold the ball with both hands, fingers spread comfortably behind the ball.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Phase 3: Execution</AccordionTrigger>
                <AccordionContent>
                    <p className="mb-2 text-muted-foreground">Bring the ball overhead with bent elbows, then extend arms forward and release with a flick of the wrists.</p>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-4">
                <AccordionTrigger>Phase 4: Follow-through</AccordionTrigger>
                <AccordionContent>
                    <p className="mb-2 text-muted-foreground">Arms should follow the path of the ball towards the target.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
        <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Get AI Feedback</h4>
            <div className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                <p>Drag & Drop Your Practice Video Here</p>
            </div>
            <Button className="mt-4 w-full"><Upload className="mr-2"/> Upload and Analyze</Button>
      </div>
    </CardContent>
  </Card>
);

const FabricDecorationModule = () => (
    <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2"><Shirt className="text-primary"/> Fabric Decoration Guide</CardTitle>
      <CardDescription>Recognize, sort, and appreciate different fabric decoration techniques.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
        <div>
            <h3 className="font-semibold mb-2">Technique Comparison</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Technique</TableHead>
                        <TableHead>Materials</TableHead>
                        <TableHead>Look and Feel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Tie-and-Dye</TableCell>
                        <TableCell>Fabric, dye, strings, pebbles</TableCell>
                        <TableCell>Creates circular, organic patterns. Vibrant and often unpredictable.</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Marbling</TableCell>
                        <TableCell>Fabric, water tray, marbling inks, thickener</TableCell>
                        <TableCell>Creates fluid, swirling patterns like natural marble stone.</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <div>
            <h3 className="font-semibold mb-2">Interactive Guide</h3>
            <Carousel className="w-full max-w-xs mx-auto">
                <CarouselContent>
                    <CarouselItem>
                        <Card>
                            <CardHeader><CardTitle>Step 1: Prepare Fabric</CardTitle></CardHeader>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-lg font-semibold">Wash and dry your fabric to remove any sizing.</span>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                         <Card>
                            <CardHeader><CardTitle>Step 2: Apply Resist</CardTitle></CardHeader>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-lg font-semibold">For tie-dye, tightly wrap sections with string.</span>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                    <CarouselItem>
                         <Card>
                            <CardHeader><CardTitle>Step 3: Add Dye</CardTitle></CardHeader>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-lg font-semibold">Apply dye to the fabric, allowing it to soak in.</span>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
        <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Identify a Technique</h4>
             <div className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                <p>Drag & Drop a Fabric Image Here</p>
            </div>
            <Button className="mt-4 w-full"><Upload className="mr-2"/> Upload and Categorize</Button>
        </div>
    </CardContent>
  </Card>
);

export default function CreativeArtsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">🎨 Creative Arts & Sports Modules</CardTitle>
          <CardDescription>
            An interactive space for learning music, sports, and visual arts based on the curriculum.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="music">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="music">Music Composition</TabsTrigger>
          <TabsTrigger value="netball">Netball Skills</TabsTrigger>
          <TabsTrigger value="fabric">Fabric Decoration</TabsTrigger>
        </TabsList>
        <TabsContent value="music">
          <MusicCompositionModule />
        </TabsContent>
        <TabsContent value="netball">
          <NetballSkillsModule />
        </TabsContent>
        <TabsContent value="fabric">
          <FabricDecorationModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    