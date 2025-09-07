
"use client";

import { useRole } from "@/hooks/use-role";
import { CountyOfficerDashboard } from "@/components/dashboards/county-officer-dashboard";
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard";
import { SchoolHeadDashboard } from "@/components/dashboards/school-head-dashboard";
import { mockTeacher } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import type { Teacher } from "@/lib/types";


export default function DashboardPage() {
  const { role } = useRole();
  const [teacher, setTeacher] = useState<Teacher>(mockTeacher);
  
  useEffect(() => {
    // We get the teacher name from localStorage to personalize the experience
    // This is a stand-in for a real auth system.
    const storedName = localStorage.getItem('userName');
    if (role === 'teacher' && storedName) {
      setTeacher(prevTeacher => ({ ...prevTeacher, name: storedName.split(' ')[0] }));
    }
  }, [role]);

  const renderDashboard = () => {
    switch (role) {
      case "teacher":
        return <TeacherDashboard teacher={teacher} />;
      case "school_head":
        return <SchoolHeadDashboard />;
      case "county_officer":
        return <CountyOfficerDashboard />;
      default:
        // Fallback for student or other roles, though students have their own journey page
        return <div><p>Welcome! Your dashboard is being prepared.</p></div>;
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
}
