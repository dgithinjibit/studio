import type { User, CurriculumDoc, Assignment, Report, County, School, Teacher, Student, Communication, TeachingStaff, NonTeachingStaff, Transaction, LearningSummary, TeacherResource } from './types';

export const mockUsers: User[] = [
  { id: 'usr_1', name: 'Asha Juma', email: 'student@example.com', role: 'student', avatar: 'https://picsum.photos/seed/1/200', schoolId: 'sch_1' },
  { id: 'usr_2', name: 'Benson Kariuki', email: 'student2@example.com', role: 'student', avatar: 'https://picsum.photos/seed/2/200', schoolId: 'sch_1' },
  { id: 'usr_3', name: 'Ms. Chidinma Okoro', email: 'teacher@example.com', role: 'teacher', avatar: 'https://picsum.photos/seed/3/200', schoolId: 'sch_1' },
];

const grade5Students: Student[] = [
    { id: 'stud_101', name: 'Asha Juma', chatTokens: 100 },
    { id: 'stud_102', name: 'Benson Kariuki', chatTokens: 85 },
    { id: 'stud_103', name: 'Charity Wanjiru', chatTokens: 100 },
    { id: 'stud_104', name: 'David Omondi', chatTokens: 45 },
    { id: 'stud_105', name: 'Esther Chebet', chatTokens: 100 },
];

const grade6Students: Student[] = [
    { id: 'stud_201', name: 'Faith Mutua', chatTokens: 90 },
    { id: 'stud_202', name: 'George Kimani', chatTokens: 100 },
    { id: 'stud_203', name: 'Hellen Atieno', chatTokens: 100 },
];

const grade4Students: Student[] = [
    { id: 'stud_301', name: 'Kamau Thuku', chatTokens: 100 },
    { id: 'stud_302', name: 'Lilian Waweru', chatTokens: 100 },
    { id: 'stud_303', name: 'Moses Otieno', chatTokens: 100 },
];

export const mockTeacher: Teacher = {
    id: 'usr_3',
    name: 'Okoro',
    classes: [
        { id: 'class_1', name: 'Grade 5 English', performance: 78, students: grade5Students, color: 'bg-blue-500' },
        { id: 'class_2', name: 'Grade 6 Science', performance: 84, students: grade6Students, color: 'bg-green-500' },
        { id: 'class_3', name: 'Grade 4 Social Studies', performance: 65, students: grade4Students, color: 'bg-orange-500' },
    ],
    totalStudents: 120,
};

export const mockLearningSummaries: LearningSummary[] = [
    {
        id: 'ls_1',
        studentId: 'stud_101',
        studentName: 'Asha Juma',
        teacherId: 'usr_3',
        subject: 'English',
        strengths: 'Asha shows great enthusiasm for storytelling and has a strong grasp of past tense verbs. She participated actively in the group discussion.',
        areasForImprovement: 'Needs more practice with irregular plural nouns and subject-verb agreement in complex sentences.',
        chatHistory: [],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        id: 'ls_2',
        studentId: 'stud_102',
        studentName: 'Benson Kariuki',
        teacherId: 'usr_3',
        subject: 'Science',
        strengths: 'Benson correctly identified the parts of a plant and explained photosynthesis clearly using local examples.',
        areasForImprovement: 'Focus on understanding the role of different soil types in agriculture.',
        chatHistory: [],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
        id: 'ls_3',
        studentId: 'stud_301',
        studentName: 'Kamau Thuku',
        teacherId: 'usr_3',
        subject: 'Social Studies',
        strengths: 'Kamau has a deep understanding of county leadership roles and how local governments serve the community.',
        areasForImprovement: 'Help Kamau connect physical features of the county to specific economic activities.',
        chatHistory: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
];

export const mockRecentResources: TeacherResource[] = [
    {
        id: 'res_1',
        title: 'Grade 5 English: Narrative Tenses',
        type: 'Lesson Plan',
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        joinCode: '',
        creatorId: 'usr_3'
    },
    {
        id: 'res_2',
        title: 'Grade 6 Science: The Solar System',
        type: 'Scheme of Work',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        joinCode: '',
        creatorId: 'usr_3'
    },
    {
        id: 'res_3',
        title: 'Grade 4 Social Studies: Our County',
        type: 'Worksheet',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        joinCode: '',
        creatorId: 'usr_3'
    }
];

export const mockCurriculumDocs: CurriculumDoc[] = [
  { id: 'doc_1', title: 'Mathematics Grade 4 Syllabus', subject: 'Mathematics', grade: 'Grade 4', url: '#' },
];

export const mockAssignments: Assignment[] = [
  { id: 'asg_1', studentName: 'Asha Juma', studentId: 'usr_1', className: 'Grade 5 English', title: 'Narrative Essay', submittedAt: new Date('2024-07-26T10:00:00Z'), url: '#' },
];

export const mockReports: Report[] = [
  {
    id: 'rep_1',
    title: 'Class Performance Analysis: Grade 5 English',
    description: 'An overview of the recent assessment results, highlighting common challenges.',
    generatedFor: ['teacher'],
    createdAt: new Date('2024-07-19T14:00:00Z'),
  },
];

export const mockCounties: County[] = [
    { id: 'county_47', name: 'Nairobi City' },
    { id: 'county_19', name: 'Nyeri' },
];

export const mockSchools: School[] = [
    { id: 'sch_1', name: 'Moi Nyeri Complex Primary School', countyId: 'county_19', latitude: -0.4134, longitude: 36.9463 },
    { id: 'sch_2', name: 'Airstrip Primary School', countyId: 'county_19', latitude: -0.4455, longitude: 36.9587 },
];

export const mockCommunications: Communication[] = [
    {
        id: 'comm_1',
        title: 'Urgent: Staff Meeting Tomorrow at 8 AM',
        content: 'Please be advised that there will be a mandatory all-staff meeting in the main hall tomorrow morning.',
        recipient: 'All Staff',
        date: new Date('2024-07-29T08:00:00Z'),
        acknowledged: false,
        sender: 'School Head',
    }
];

export const initialTeachingStaff: TeachingStaff[] = [
    { id: 't-1', name: 'Ms. Chidinma Okoro', tscNo: 'TSC-12345', role: 'English/Literature', category: 'Teaching' },
];

export const initialNonTeachingStaff: NonTeachingStaff[] = [
    { id: 'nt-1', name: 'Mr. James Ochieng', role: 'Bursar', category: 'Non-Teaching' },
];

export const mockTransactions: Transaction[] = [
  { id: 'txn_1', date: '2024-07-30', description: 'Purchase of PP1 Textbooks', amount: 15000, category: 'Instructional Materials', status: 'Completed' },
];