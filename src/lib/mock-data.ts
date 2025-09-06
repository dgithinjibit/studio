import type { User, CurriculumDoc, Assignment, Report, UserRole } from './types';

export const mockUsers: User[] = [
  { id: 'usr_1', name: 'Asha Juma', email: 'asha.juma@example.com', role: 'student', avatar: 'https://i.pravatar.cc/150?u=usr_1' },
  { id: 'usr_2', name: 'Benson Kariuki', email: 'benson.kariuki@example.com', role: 'student', avatar: 'https://i.pravatar.cc/150?u=usr_2' },
  { id: 'usr_3', name: 'Ms. Chidinma Okoro', email: 'chidinma.okoro@example.com', role: 'teacher', avatar: 'https://i.pravatar.cc/150?u=usr_3' },
  { id: 'usr_4', name: 'Mr. David Mwangi', email: 'david.mwangi@example.com', role: 'teacher', avatar: 'https://i.pravatar.cc/150?u=usr_4' },
  { id: 'usr_5', name: 'Dr. Evelyn Wanjala', email: 'evelyn.wanjala@example.com', role: 'school_head', avatar: 'https://i.pravatar.cc/150?u=usr_5' },
  { id: 'usr_6', name: 'Mr. Felix Omondi', email: 'felix.omondi@example.com', role: 'county_officer', avatar: 'https://i.pravatar.cc/150?u=usr_6' },
];

export const mockCurriculumDocs: CurriculumDoc[] = [
  { id: 'doc_1', title: 'Mathematics Form 1 Syllabus', subject: 'Mathematics', grade: 'Form 1', url: '#' },
  { id: 'doc_2', title: 'English Form 1 Syllabus', subject: 'English', grade: 'Form 1', url: '#' },
  { id: 'doc_3', title: 'Kiswahili Form 2 Syllabus', subject: 'Kiswahili', grade: 'Form 2', url: '#' },
  { id: 'doc_4', title: 'Chemistry Form 3 Practical Guide', subject: 'Chemistry', grade: 'Form 3', url: '#' },
  { id: 'doc_5', title: 'History & Government Form 4 Notes', subject: 'History', grade: 'Form 4', url: '#' },
];

export const mockAssignments: Assignment[] = [
  { id: 'asg_1', studentName: 'Asha Juma', studentId: 'usr_1', className: 'Form 1', title: 'Algebra Homework', submittedAt: new Date('2023-10-26T10:00:00Z'), url: '#' },
  { id: 'asg_2', studentName: 'Benson Kariuki', studentId: 'usr_2', className: 'Form 1', title: 'Composition: My Family', submittedAt: new Date('2023-10-25T15:30:00Z'), url: '#' },
  { id: 'asg_3', studentName: 'Asha Juma', studentId: 'usr_1', className: 'Form 1', title: 'Poetry Analysis', submittedAt: new Date('2023-10-22T11:00:00Z'), url: '#' },
];

export const mockReports: Report[] = [
  {
    id: 'rep_1',
    title: 'Personal Progress Report - Q3 2023',
    description: 'Your academic performance and areas for improvement in Mathematics and English.',
    generatedFor: ['student'],
    createdAt: new Date('2023-10-20T09:00:00Z'),
  },
  {
    id: 'rep_2',
    title: 'Class Performance Analysis: Form 2 English',
    description: 'An overview of the recent assessment results for Form 2 English, highlighting common challenges.',
    generatedFor: ['teacher'],
    createdAt: new Date('2023-10-19T14:00:00Z'),
  },
    {
    id: 'rep_3',
    title: 'Teacher Engagement Report',
    description: 'Summary of curriculum resource downloads and assignment feedback rates for all teachers.',
    generatedFor: ['school_head'],
    createdAt: new Date('2023-10-18T11:00:00Z'),
  },
  {
    id: 'rep_4',
    title: 'County Education Metrics - Q3 2023',
    description: 'Aggregated data on student performance and resource utilization across all schools in the county.',
    generatedFor: ['county_officer'],
    createdAt: new Date('2023-10-17T16:00:00Z'),
  },
   {
    id: 'rep_5',
    title: 'School-wide Attendance Report',
    description: 'Weekly attendance data and trends across all classes.',
    generatedFor: ['teacher', 'school_head'],
    createdAt: new Date('2023-10-21T09:00:00Z'),
  },
];
