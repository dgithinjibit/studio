
'use server';

import type { User, UserRole } from './types';
import { cookies } from 'next/headers';

// In a real application, this would involve validating a session cookie,
// database lookups, etc. For this prototype, we'll simulate it by
// reading the role that was set in localStorage during signup.
// We'll use a simple "cookie" to simulate this server-side.

export async function getServerUser(): Promise<Partial<User> | null> {
    const cookieStore = cookies();
    const userRoleCookie = cookieStore.get('userRole');
    const userNameCookie = cookieStore.get('userName');
    
    const role = userRoleCookie?.value as UserRole | undefined;
    const name = userNameCookie?.value;

    if (!role || !name) {
        // This simulates a user who is not logged in or has no role.
        // Defaulting to 'teacher' is a safe fallback for this application's context.
        return {
            name: "Teacher",
            role: "teacher"
        };
    }

    return {
        name,
        role,
    };
}
