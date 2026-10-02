import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { Profile } from '../types/portfolio.ts';

interface FooterProps {
  profile: Profile;
  onOpenAdmin: () => void;
}

export function Footer({ profile, onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#060a12] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="font-bold text-white text-sm font-display tracking-tight">
            {profile.name}
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>© {new Date().getFullYear()} All Rights Reserved. Crafted with React, Node.js & MongoDB.</span>
        </div>

        {/* Quick Links & Back to top */}
        <div className="flex items-center gap-6">
          {profile.github && (
            <a 
              href={profile.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {profile.linkedin && (
            <a 
              href={profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-400 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          <a 
            href={`mailto:${profile.email}`} 
            className="hover:text-cyan-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenAdmin}
            className="hover:text-cyan-400 transition-colors underline"
          >
            Admin Panel
          </button>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
