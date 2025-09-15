
import AuthForm from '@/components/auth-form';

export default function SignUp() {
    // The AuthForm component handles both sign-up and sign-in logic.
    // The isSignUp prop is set to true to show the name field and handle user creation.
    return <AuthForm isSignUp={true} />;
}
