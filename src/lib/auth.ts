
'use server';

import type { User, UserRole } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * A Server Action to set the user's role and name in cookies and redirect.
 * This is bound directly to the signup form.
 */
export async function signupUser(role: UserRole, formData: FormData) {
  const fullName = formData.get('fullName') as string;

  if (!role || !fullName) {
    // Handle error case, maybe redirect back with an error message
    return;
  }
  
  const cookieStore = cookies();
  cookieStore.set('userRole', role, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  cookieStore.set('userName', fullName, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  // Redirect after setting cookies
  if (role === 'student') {
    redirect('/student/journey');
  } else {
    redirect('/dashboard');
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
