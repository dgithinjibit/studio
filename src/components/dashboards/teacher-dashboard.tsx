
'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  testsCompleted: number;
}

interface Class {
  id: string;
  name: string;
  subject?: string;
  studentCount: number;
  averageProgress: number;
}

interface TeacherData {
  name: string;
  email: string;
  classes: Class[];
  totalStudents: number;
  recentStudents: Student[];
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      setError(null);

      const auth = getAuth(app);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('No authenticated user found. Please log in.');
        setLoading(false);
        return;
      }

      const db = getFirestore(app);

      // Fetch teacher profile
      const teacherDoc = await getDoc(doc(db, 'teachers', currentUser.uid));
      
      if (!teacherDoc.exists()) {
        setError('NEEDS_SEEDING');
        setLoading(false);
        return;
      }

      const teacherProfile = teacherDoc.data();

      // Fetch classes taught by this teacher
      const classesQuery = query(
        collection(db, 'classes'),
        where('teacherId', '==', currentUser.uid)
      );
      const classesSnapshot = await getDocs(classesQuery);

      if (classesSnapshot.empty) {
        setError('NEEDS_SEEDING');
        setLoading(false);
        return;
      }

      const classes: Class[] = [];
      let totalStudents = 0;

      for (const classDoc of classesSnapshot.docs) {
        const classData = classDoc.data();
        
        // Count students in this class
        const studentsQuery = query(
          collection(db, 'students'),
          where('classId', '==', classDoc.id)
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        
        // Calculate average progress
        let totalProgress = 0;
        studentsSnapshot.docs.forEach(studentDoc => {
          const studentData = studentDoc.data();
          totalProgress += studentData.progress || 0;
        });

        const studentCount = studentsSnapshot.size;
        const averageProgress = studentCount > 0 ? totalProgress / studentCount : 0;

        classes.push({
          id: classDoc.id,
          name: classData.name || 'Unnamed Class',
          subject: classData.subject,
          studentCount,
          averageProgress: Math.round(averageProgress)
        });

        totalStudents += studentCount;
      }

      // Fetch recent students
      const allStudentsQuery = query(
        collection(db, 'students'),
        where('teacherId', '==', currentUser.uid)
      );
      const allStudentsSnapshot = await getDocs(allStudentsQuery);

      const recentStudents: Student[] = allStudentsSnapshot.docs
        .map(studentDoc => {
          const data = studentDoc.data();
          const lastActiveDate = data.lastActive?.toDate?.();
          return {
            id: studentDoc.id,
            name: data.name || 'Unknown',
            email: data.email || '',
            progress: data.progress || 0,
            lastActive: lastActiveDate ? lastActiveDate.toLocaleDateString() : 'Never',
            testsCompleted: data.testsCompleted || 0
          };
        })
        .sort((a, b) => {
          const dateA = new Date(a.lastActive).getTime() || 0;
          const dateB = new Date(b.lastActive).getTime() || 0;
          return dateB - dateA;
        })
        .slice(0, 5);

      setTeacherData({
        name: teacherProfile.name || currentUser.email || 'Teacher',
        email: currentUser.email || '',
        classes,
        totalStudents,
        recentStudents
      });

    } catch (err) {
      console.error('Error fetching teacher data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Wait a moment for Firestore to update, then refetch
        setTimeout(() => {
          fetchTeacherData();
        }, 2000);
      } else {
        setError(data.message || 'Failed to seed database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTeacherData();
      } else {
        setLoading(false);
        setError('No authenticated user found. Please log in.');
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error === 'NEEDS_SEEDING') {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-6">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md text-center border">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Welcome, Teacher!</h3>
            <p className="text-muted-foreground mb-6">
              Your account is ready. Let's populate your dashboard with some sample classes and students to get you started.
            </p>
          </div>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
          >
            {seeding ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Seeding Database...
              </span>
            ) : (
              'Seed Sample Data'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-8 max-w-md">
          <h3 className="text-destructive font-semibold mb-2 text-lg">Error Loading Dashboard</h3>
          <p className="text-destructive/80 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={fetchTeacherData}
              className="flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return null; // Should be handled by loading or error states
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {teacherData.name}
            </h1>
            <p className="text-muted-foreground">{teacherData.email}</p>
          </div>
          <button
            onClick={fetchTeacherData}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Classes</div>
            <div className="text-3xl font-bold text-primary">
              {teacherData.classes.length}
            </div>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Students</div>
            <div className="text-3xl font-bold text-green-500">
              {teacherData.totalStudents}
            </div>
          </div>
          <div className="bg-card rounded-lg shadow p-6">
            <div className="text-sm text-muted-foreground mb-1">Average Progress</div>
            <div className="text-3xl font-bold text-purple-500">
              {teacherData.classes.length > 0
                ? Math.round(
                    teacherData.classes.reduce((sum, c) => sum + c.averageProgress, 0) /
                      teacherData.classes.length
                  )
                : 0}%
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-foreground">Your Classes</h2>
          </div>
          <div className="p-6">
            {teacherData.classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No classes yet. Use the 'Seed Data' button to create sample classes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherData.classes.map(classItem => (
                  <div
                    key={classItem.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-semibold text-foreground mb-1">
                      {classItem.name}
                    </h3>
                    {classItem.subject && (
                      <p className="text-sm text-muted-foreground mb-2">{classItem.subject}</p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{classItem.studentCount} students</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${classItem.averageProgress}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-foreground">{classItem.averageProgress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-foreground">Recent Student Activity</h2>
          </div>
          <div className="p-6">
            {teacherData.recentStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No student activity yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b">
                      <th className="pb-3 font-medium">Student</th>
                      <th className="pb-3 font-medium">Progress</th>
                      <th className="pb-3 font-medium">Tests Completed</th>
                      <th className="pb-3 font-medium">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherData.recentStudents.map(student => (
                      <tr key={student.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                        <td className="py-3">
                          <div>
                            <div className="font-medium text-foreground">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-20 bg-muted rounded-full h-2 mr-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-foreground font-medium">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-foreground">{student.testsCompleted}</td>
                        <td className="py-3 text-foreground">{student.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
