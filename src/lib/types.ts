export type UserRole = 'student' | 'teacher' | 'school_head' | 'county_officer';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId?: string; 
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
};