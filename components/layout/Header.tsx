'use client';

import { Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="h-16 border-b px-6 flex items-center justify-between bg-background">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}