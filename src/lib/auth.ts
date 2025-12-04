
'use server';

import type { User, UserRole } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * A Server Action to set the user's role and name in cookies.
 * It returns the path to redirect to upon successful signup.
 */
export async function signupUser(role: UserRole, formData: FormData): Promise<string> {
  const fullName = formData.get('fullName') as string;

  if (!role || !fullName) {
    throw new Error("Role or Full Name is missing.");
  }
  
  const cookieStore = cookies();
  cookieStore.set('userRole', role, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  cookieStore.set('userName', fullName, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  // Return the redirect path instead of calling redirect()
  if (role === 'student') {
    return '/student/journey';
  } else {
    return '/dashboard';
  }
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
        // If no role or name is found in the cookies, return null.
        // The UI will handle this by showing a loading state or redirecting.
        // DO NOT return a default user object here.
        return null;
    }

    return {
        name,
        role,
    };
}
