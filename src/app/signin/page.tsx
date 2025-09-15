
Runtime Error


Error: [object Object]

Call Stack
4

Hide 4 ignore-listed frame(s)
onUnhandledRejection
node_modules/next/src/client/components/errors/use-error-handler.ts (122:13)
Router
node_modules/next/src/client/components/app-router.tsx (510:7)
AppRouter
node_modules/next/src/client/components/app-router.tsx (571:7)
ServerRoot
node_modules/next/src/client/app-index.tsx (171:5)
1
import AuthForm from '@/components/auth-form';

export default function SignIn() {
    // The isSignUp prop is set to false to hide the name field and handle user login.
    return <AuthForm isSignUp={false} />;
}
