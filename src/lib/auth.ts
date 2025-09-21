
'use server';

import type { User, UserRole } from './types';
import { cookies } from 'next/headers';

/**
 * A Server Action to set the user's role and name in cookies.
 * This is the correct way to bridge state from client-side actions (like signup)
 * to server-side rendering.
 */
export async function updateUserRoleCookie(role: UserRole, name: string) {
  const cookieStore = cookies();
  cookieStore.set('userRole', role, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  cookieStore.set('userName', name, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}


// In a real application, this would involve validating a session cookie,
// database lookups, etc. For this prototype, we simulate it by
// reading the role that was set in the cookie store.

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
