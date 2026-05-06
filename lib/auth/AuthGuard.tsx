'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Salva a rota atual para redirecionar após login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.replace(redirectTo);
    }
  }, [router, pathname, redirectTo]);

  return <>{children}</>;
}