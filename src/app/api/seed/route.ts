
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { mockTeacher } from '@/lib/mock-data';

export async function GET() {
  try {
    // Seed the teacher data
    const teacherRef = doc(db, 'teachers', mockTeacher.id);
    await setDoc(teacherRef, mockTeacher);

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ success: false, message: 'Failed to seed database.' }, { status: 500 });
  }
}
