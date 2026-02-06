import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import { isAuthenticated } from '@/lib/auth';

export default function Layout({ children }) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  useEffect(() => {
    // Redirect to login if not authenticated (except on login page)
    if (!isLoginPage && !isAuthenticated()) {
      router.push('/login');
    }
  }, [router.pathname, isLoginPage]);

  // Don't show header on login page
  if (isLoginPage) {
    return (
      <div className="min-h-screen dental-pattern" style={{ position: 'relative' }}>
        <main style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </div>
    );
  }

  // Show header on all other pages
  return (
    <div className="min-h-screen dental-pattern" style={{ position: 'relative' }}>
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}
