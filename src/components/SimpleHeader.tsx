'use client';
import Link from 'next/link';
import { clientEnv } from '@/config/client-env';
import AgentforceLogo from './AgentforceLogo';

export default function SimpleHeader() {
  return (
    <header className="bg-white/20 text-white backdrop-blur-lg w-full shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <AgentforceLogo size="small" alt="Agentforce" />
          <span className="text-xl font-semibold">{clientEnv.NEXT_PUBLIC_APP_TITLE}</span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="https://www.heroku.com/platform/" target="_blank" className="hover:text-blue-200 transition-colors">
            More
          </a>
        </nav>
      </div>
    </header>
  );
} 