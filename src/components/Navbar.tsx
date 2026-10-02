import { useState } from 'react';
import { Lock, Menu, X, Database } from 'lucide-react';
import { DbStatus } from '../types/portfolio.ts';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  dbStatus?: DbStatus;
}

export function Navbar({ onOpenAdmin, isAdminLoggedIn, dbStatus }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080c14]/85 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <a 
          href="#home" 
          className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors font-display"
        >
          Estiak Ahmed
        </a>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#experience" className="hover:text-cyan-400 transition-colors">Experience</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Subtle DB Status Indicator */}
          {dbStatus && (
            <div 
              title={dbStatus.message}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 border border-white/10 rounded-md bg-white/[0.02]"
            >
              <Database className={`w-3.5 h-3.5 ${dbStatus.connected ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden xl:inline">{dbStatus.connected ? 'MongoDB Connected' : 'Local DB (Mongo ready)'}</span>
            </div>
          )}

          {/* Admin Access Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              isAdminLoggedIn
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>
          </button>

          {/* Contact Action */}
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 active:scale-95 transition-all shadow-sm shadow-cyan-500/20 whitespace-nowrap"
          >
            Hire Me
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080c14] px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate-300 animate-in fade-in slide-in-from-top-2">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-cyan-400 py-1"
          >
            About
          </a>
          <a 
            href="#skills" 
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-cyan-400 py-1"
          >
            Skills
          </a>
          <a 
            href="#projects" 
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-cyan-400 py-1"
          >
            Projects
          </a>
          <a 
            href="#experience" 
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-cyan-400 py-1"
          >
            Experience
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="hover:text-cyan-400 py-1"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
