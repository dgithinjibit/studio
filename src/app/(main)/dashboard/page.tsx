
"use client";

import { useState, useEffect } from 'react';
import type { Teacher } from '@/lib/types';
import { mockTeacher } from '@/lib/mock-data';
import { TeacherDashboard } from '@/components/dashboards/teacher-dashboard';
import { SchoolHeadDashboard } from '@/components/dashboards/school-head-dashboard';
import { CountyOfficerDashboard } from '@/components/dashboards/county-officer-dashboard';
import { useRole } from '@/hooks/use-role';

export default function DashboardPage() {
    // For now, we will default to the teacher dashboard for a streamlined experience.
    // The role-based logic can be re-introduced later.
    return <TeacherDashboard teacher={mockTeacher} />;
}
