

export type UserRole = 'student' | 'teacher' | 'school_head' | 'county_officer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId?: string; 
};

export type Student = {
    id: string;
    name: string;
};

export type ClassInfo = {
    id: string;
    name: string;
    performance: number;
    students: Student[];
};

export type Teacher = {
    id: string;
    name: string;
    classes: ClassInfo[];
    totalStudents: number;
};

export type CurriculumDoc = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  url: string;
};

export type Assignment = {
  id: string;
  studentName: string;
  studentId: string;
  className: string;
  title: string;
  submittedAt: Date;
  url: string;
};

export type Report = {
  id:string;
  title: string;
  description: string;
  generatedFor: UserRole[];
  createdAt: Date;
};

export type County = {
  id: string;
  name: string;
};

export type School = {
  id: string;
  name: string;
  countyId: string;
  latitude: number;
  longitude: number;
};

export type TeacherResource = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  type: 'Lesson Plan' | 'Scheme of Work' | 'Rubric' | 'Worksheet' | 'Differentiated Worksheet' | 'AI Tutor Context' | 'Other';
};

export type Communication = {
  id: string;
  title: string;
  content: string;
  recipient: string;
  date: string;
  acknowledged: boolean;
  sender?: string;
};

export type SchoolResource = {
  id: string;
  schoolName: string;
  resourceName: string;
  quantity: number;
  dateAllocated: string;
};
