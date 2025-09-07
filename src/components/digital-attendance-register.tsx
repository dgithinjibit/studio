
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { ClassInfo, Student } from '@/lib/types';
import { PlusCircle, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface DigitalAttendanceRegisterProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classInfo: ClassInfo;
}

type AttendanceStatus = 'present' | 'absent';
type AttendanceRecord = {
    morning?: AttendanceStatus;
    evening?: AttendanceStatus;
};
type AttendanceState = Record<string, Record<string, AttendanceRecord>>; // { [date]: { [studentId]: record } }

export function DigitalAttendanceRegister({ open, onOpenChange, classInfo }: DigitalAttendanceRegisterProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [attendance, setAttendance] = useState<AttendanceState>({});
    const [students, setStudents] = useState<Student[]>(classInfo.students);
    const [newStudentName, setNewStudentName] = useState('');
    const { toast } = useToast();

    // Load attendance from localStorage when the component mounts or classInfo changes
    useEffect(() => {
        if (open) {
            const storedAttendance = localStorage.getItem(`attendance_${classInfo.name}`);
            if (storedAttendance) {
                setAttendance(JSON.parse(storedAttendance));
            } else {
                setAttendance({});
            }
            const storedStudents = localStorage.getItem(`students_${classInfo.name}`);
            if (storedStudents) {
                setStudents(JSON.parse(storedStudents));
            } else {
                 setStudents(classInfo.students);
            }
        }
    }, [classInfo.name, open]);

    // Save attendance to localStorage whenever it changes
    useEffect(() => {
        if(open) {
            localStorage.setItem(`attendance_${classInfo.name}`, JSON.stringify(attendance));
        }
    }, [attendance, classInfo.name, open]);
    
    useEffect(() => {
        if(open) {
            localStorage.setItem(`students_${classInfo.name}`, JSON.stringify(students));
        }
    }, [students, classInfo.name, open]);

    const handleAttendanceChange = (studentId: string, session: 'morning' | 'evening', checked: boolean) => {
        if (!selectedDate) return;
        const dateKey = format(selectedDate, 'yyyy-MM-dd');
        
        setAttendance(prev => {
            const newAttendance = { ...prev };
            if (!newAttendance[dateKey]) newAttendance[dateKey] = {};
            if (!newAttendance[dateKey][studentId]) newAttendance[dateKey][studentId] = {};
            
            newAttendance[dateKey][studentId][session] = checked ? 'present' : 'absent';
            return newAttendance;
        });
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentName.trim()) return;

        const newStudent: Student = {
            id: `stud_${Date.now()}`,
            name: newStudentName.trim(),
        };

        setStudents(prev => [...prev, newStudent]);
        setNewStudentName('');
        toast({
            title: 'Student Added',
            description: `${newStudent.name} has been added to ${classInfo.name}.`,
        });
    };
    
    const handleDeleteStudent = (studentId: string) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
         toast({
            title: 'Student Removed',
            variant: 'destructive'
        });
    }

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const dailyAttendance = attendance[dateKey] || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Digital Attendance Register</DialogTitle>
                    <DialogDescription>
                        Marking attendance for <span className="font-bold text-primary">{classInfo.name}</span> on <span className="font-bold text-primary">{selectedDate ? format(selectedDate, 'PPP') : ''}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
                    <div className="md:col-span-1 flex flex-col gap-4">
                         <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                         <form onSubmit={handleAddStudent} className="border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold flex items-center gap-2"><PlusCircle className="w-5 h-5"/> Add New Student</h3>
                            <Input 
                                placeholder="Enter student's full name"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                            />
                            <Button type="submit" className="w-full">Add to Register</Button>
                         </form>
                    </div>
                    <div className="md:col-span-2 flex flex-col min-h-0">
                         <h3 className="font-semibold mb-2">Student List ({students.length})</h3>
                        <ScrollArea className="flex-1 border rounded-md">
                           <Table>
                                <TableHeader className="sticky top-0 bg-muted">
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="text-center">Morning</TableHead>
                                        <TableHead className="text-center">Evening</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map(student => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> {student.name}</TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox 
                                                    checked={dailyAttendance[student.id]?.morning === 'present'}
                                                    onCheckedChange={(checked) => handleAttendanceChange(student.id, 'morning', !!checked)}
                                                    disabled={!selectedDate}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Checkbox 
                                                    checked={dailyAttendance[student.id]?.evening === 'present'}
                                                    onCheckedChange={(checked) => handleAttendanceChange(student.id, 'evening', !!checked)}
                                                    disabled={!selectedDate}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                           </Table>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
