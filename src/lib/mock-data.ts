import type { User, CurriculumDoc, Assignment, Report, County, School } from './types';

export const mockUsers: User[] = [
  { id: 'usr_1', name: 'Asha Juma', email: 'asha.juma@example.com', role: 'student', avatar: 'https://i.pravatar.cc/150?u=usr_1', schoolId: 'sch_1' },
  { id: 'usr_2', name: 'Benson Kariuki', email: 'benson.kariuki@example.com', role: 'student', avatar: 'https://i.pravatar.cc/150?u=usr_2', schoolId: 'sch_1' },
  { id: 'usr_3', name: 'Ms. Chidinma Okoro', email: 'chidinma.okoro@example.com', role: 'teacher', avatar: 'https://i.pravatar.cc/150?u=usr_3', schoolId: 'sch_1' },
  { id: 'usr_4', name: 'Mr. David Mwangi', email: 'david.mwangi@example.com', role: 'teacher', avatar: 'https://i.pravatar.cc/150?u=usr_4', schoolId: 'sch_2' },
  { id: 'usr_5', name: 'Dr. Evelyn Wanjala', email: 'evelyn.wanjala@example.com', role: 'school_head', avatar: 'https://i.pravatar.cc/150?u=usr_5', schoolId: 'sch_1' },
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


export const mockCounties: County[] = [
    { id: 'county_1', name: 'Mombasa' },
    { id: 'county_2', name: 'Kwale' },
    { id: 'county_3', name: 'Kilifi' },
    { id: 'county_4', name: 'Tana River' },
    { id: 'county_5', name: 'Lamu' },
    { id: 'county_6', name: 'Taita-Taveta' },
    { id: 'county_7', name: 'Garissa' },
    { id: 'county_8', name: 'Wajir' },
    { id: 'county_9', name: 'Mandera' },
    { id: 'county_10', name: 'Marsabit' },
    { id: 'county_11', name: 'Isiolo' },
    { id: 'county_12', name: 'Meru' },
    { id: 'county_13', name: 'Tharaka-Nithi' },
    { id: 'county_14', name: 'Embu' },
    { id: 'county_15', name: 'Kitui' },
    { id: 'county_16', name: 'Machakos' },
    { id: 'county_17', name: 'Makueni' },
    { id: 'county_18', name: 'Nyandarua' },
    { id: 'county_19', name: 'Nyeri' },
    { id: 'county_20', name: 'Kirinyaga' },
    { id: 'county_21', name: 'Murang\'a' },
    { id: 'county_22', name: 'Kiambu' },
    { id: 'county_23', name: 'Turkana' },
    { id: 'county_24', name: 'West Pokot' },
    { id: 'county_25', name: 'Samburu' },
    { id: 'county_26', name: 'Trans Nzoia' },
    { id: 'county_27', name: 'Uasin Gishu' },
    { id: 'county_28', name: 'Elgeyo-Marakwet' },
    { id: 'county_29', name: 'Nandi' },
    { id: 'county_30', name: 'Baringo' },
    { id: 'county_31', name: 'Laikipia' },
    { id: 'county_32', name: 'Nakuru' },
    { id: 'county_33', name: 'Narok' },
    { id: 'county_34', name: 'Kajiado' },
    { id: 'county_35', name: 'Kericho' },
    { id: 'county_36', name: 'Bomet' },
    { id: 'county_37', name: 'Kakamega' },
    { id: 'county_38', name: 'Vihiga' },
    { id: 'county_39', name: 'Bungoma' },
    { id: 'county_40', name: 'Busia' },
    { id: 'county_41', name: 'Siaya' },
    { id: 'county_42', name: 'Kisumu' },
    { id: 'county_43', name: 'Homa Bay' },
    { id: 'county_44', name: 'Migori' },
    { id: 'county_45', name: 'Kisii' },
    { id: 'county_46', name: 'Nyamira' },
    { id: 'county_47', name: 'Nairobi City' },
];

export const mockSchools: School[] = [
    { id: 'sch_1', name: 'Nairobi School', countyId: 'county_47' },
    { id: 'sch_2', name: 'Alliance High School', countyId: 'county_22' },
    { id: 'sch_3', name: 'Shimo La Tewa High School', countyId: 'county_1' },
    { id: 'sch_4', name: 'Kisumu Boys High School', countyId: 'county_42' },
    { id: 'sch_5', name: 'Miiri Primary School', countyId: 'county_19' },
    { id: 'sch_6', name: 'Kiamucheru Primary School', countyId: 'county_19' },
    { id: 'sch_7', name: 'Gatura Primary School', countyId: 'county_19' },
    { id: 'sch_8', name: 'Mathaithi Primary School', countyId: 'county_19' },
    { id: 'sch_9', name: 'Kiamwangi Primary School', countyId: 'county_19' },
    { id: 'sch_10', name: 'Future Leaders Academy', countyId: 'county_19' },
    { id: 'sch_11', name: 'Ngari Junior Academy', countyId: 'county_19' },
    { id: 'sch_12', name: 'Ngunguru Primary School', countyId: 'county_19' },
    { id: 'sch_13', name: 'Archbishop Kirima Primary School', countyId: 'county_19' },
];
