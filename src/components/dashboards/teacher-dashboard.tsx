'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase'; // Adjust path to your firebase config

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

  useEffect(() => {
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
          setError('Teacher profile not found.');
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
            studentCount,
            averageProgress: Math.round(averageProgress)
          });

          totalStudents += studentCount;
        }

        // Fetch recent students (last 5 active students across all classes)
        const allStudentsQuery = query(
          collection(db, 'students'),
          where('teacherId', '==', currentUser.uid)
        );
        const allStudentsSnapshot = await getDocs(allStudentsQuery);

        const recentStudents: Student[] = allStudentsSnapshot.docs
          .map(studentDoc => {
            const data = studentDoc.data();
            return {
              id: studentDoc.id,
              name: data.name || 'Unknown',
              email: data.email || '',
              progress: data.progress || 0,
              lastActive: data.lastActive?.toDate?.()?.toLocaleDateString() || 'Never',
              testsCompleted: data.testsCompleted || 0
            };
          })
          .sort((a, b) => {
            // Sort by last active (most recent first)
            const dateA = new Date(a.lastActive).getTime();
            const dateB = new Date(b.lastActive).getTime();
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

    fetchTeacherData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {teacherData.name}
          </h1>
          <p className="text-gray-600">{teacherData.email}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Classes</div>
            <div className="text-3xl font-bold text-blue-600">
              {teacherData.classes.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Total Students</div>
            <div className="text-3xl font-bold text-green-600">
              {teacherData.totalStudents}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">Average Progress</div>
            <div className="text-3xl font-bold text-purple-600">
              {teacherData.classes.length > 0
                ? Math.round(
                    teacherData.classes.reduce((sum, c) => sum + c.averageProgress, 0) /
                      teacherData.classes.length
                  )
                : 0}%
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Classes</h2>
          </div>
          <div className="p-6">
            {teacherData.classes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No classes yet. Create your first class to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherData.classes.map(classItem => (
                  <div
                    key={classItem.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {classItem.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{classItem.studentCount} students</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${classItem.averageProgress}%` }}
                          ></div>
                        </div>
                        <span>{classItem.averageProgress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Students Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Student Activity</h2>
          </div>
          <div className="p-6">
            {teacherData.recentStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No student activity yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">Student</th>
                      <th className="pb-3 font-medium">Progress</th>
                      <th className="pb-3 font-medium">Tests Completed</th>
                      <th className="pb-3 font-medium">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherData.recentStudents.map(student => (
                      <tr key={student.id} className="border-b last:border-b-0">
                        <td className="py-3">
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-700">{student.testsCompleted}</td>
                        <td className="py-3 text-gray-700">{student.lastActive}</td>
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
