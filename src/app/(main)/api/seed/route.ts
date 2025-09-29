
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { mockTeacher } from '@/lib/mock-data';

export async function GET() {
  try {
    // We are seeding data for a specific teacher ID 'usr_3'
    const teacherRef = doc(db, 'teachers', 'usr_3');
    await setDoc(teacherRef, mockTeacher);
    
    return NextResponse.json({ message: 'Teacher data seeded successfully.' });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ message: 'Error seeding data.', error }, { status: 500 });
  }
}
