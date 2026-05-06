'use client';

import { memo, useMemo } from 'react';
import { IconDashboard, IconReceipt, IconSettings, IconLogout } from '@tabler/icons-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

export const AppSidebar = memo(function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: 'Usuário',
    email: 'teste@tax.com',
    avatar: '',
  };

  const mainItems = useMemo(() => [
    { title: 'Dashboard', url: '/dashboard', icon: IconDashboard },
    { title: 'Operações', url: '/operations', icon: IconReceipt },
    { title: 'Configurações', url: '/settings', icon: IconSettings },
  ], []);

  const secondaryItems = useMemo(() => [
    { title: 'Suporte', url: '/support', icon: IconLogout },
  ], []);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="flex items-center justify-center p-4">
        <span className="font-bold group-data-[collapsible=icon]:hidden">
          Trading Wallet
        </span>
        <span className="font-bold hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
          TW
        </span>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});