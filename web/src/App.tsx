import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import Home from './pages/Home';
import Login from './pages/Login';

function LoadingScreen() {
  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <div className="text-primary h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}

export default function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Home />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
