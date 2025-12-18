
'use server';

import type { User, UserRole } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';

/**
 * A Server Action to set the user's role and name in cookies.
 * It returns the path to redirect to upon successful signup.
 */
export async function signupUser(role: UserRole, formData: FormData): Promise<string> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;

  if (!role || !fullName || !email) {
    throw new Error("Role, Full Name, or Email is missing.");
  }
  
  const auth = getAuth(app);
  // This relies on the client-side to have created the user first.
  // A more robust solution would handle user creation here.
  const user = auth.currentUser;

  if (user) {
      const db = getFirestore(app);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        name: fullName,
        role: role,
        createdAt: new Date().toISOString(),
      });
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
    // While we still use cookies for quick client-side rendering,
    // the authoritative role should come from the database.
    // This is a simplified example; a real app would use server-side session validation.
    const userNameCookie = cookieStore.get('userName');
    
    // In a real app, you'd get the UID from a secure, server-only session cookie.
    // For this prototype, we'll assume we can get it after client-side auth.
    // This part of the logic is illustrative and not fully secure without a proper backend session.
    const userEmailCookie = cookieStore.get('userEmail');
    if (!userEmailCookie?.value) {
        return null;
    }
    
    // The name is less critical, but the role MUST be fetched securely.
    const name = userNameCookie?.value;

    return {
        name,
        // The role is now illustrative, the real role check should happen in protected server actions/api routes
        role: cookieStore.get('userRole')?.value as UserRole | undefined,
    };
}
