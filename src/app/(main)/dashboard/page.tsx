
"use client";

import { AppHeader } from "@/components/layout/app-header";
import { useRole } from "@/hooks/use-role";
import { CountyOfficerDashboard } from "@/components/dashboards/county-officer-dashboard";
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard";
import { SchoolHeadDashboard } from "@/components/dashboards/school-head-dashboard";
import { mockTeacher } from "@/lib/mock-data";


export default function DashboardPage() {
  const { role } = useRole();

  const renderDashboard = () => {
    switch (role) {
      case "teacher":
        return <TeacherDashboard teacher={mockTeacher} />;
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
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6">
        {renderDashboard()}
      </main>
    </>
  );
}
