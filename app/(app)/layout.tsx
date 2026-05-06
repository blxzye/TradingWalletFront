'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthGuard } from '@/lib/auth/AuthGuard';
import { QueryProvider } from '@/lib/react-query/QueryProvider';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <QueryProvider>
        <TooltipProvider>
          <SidebarProvider
            style={
              {
                '--sidebar-width': 'calc(var(--spacing) * 50)',
                '--header-height': 'calc(var(--spacing) * 12)',
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <SiteHeader />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </QueryProvider>
    </AuthGuard>
  );
}