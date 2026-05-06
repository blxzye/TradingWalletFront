'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">Trading Wallet</h1>
      <p className="text-xl text-gray-400 mb-8">Gestão patrimonial com ledger bancário</p>
      <Link href="/login">
        <Button size="lg">Acessar Dashboard</Button>
      </Link>
    </div>
  );
}