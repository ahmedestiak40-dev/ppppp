import { ArrowUpRight, Github, Linkedin, Mail, FileText, Sparkles } from 'lucide-react';
import { Profile } from '../types/portfolio.ts';

interface HeroProps {
  profile: Profile;
  onOpenResume?: () => void;
}

export function Hero({ profile, onOpenResume }: HeroProps) {
  return (
    <section id="home" className="relative pt-12 pb-20 md:py-24 overflow-hidden border-b border-white/[0.06]">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Narrative & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Status indicator (Unboxed quiet text) */}
            <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-mono mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{profile.availabilityStatus || 'Available for freelance & full-time opportunities'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-display max-w-2xl text-balance">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">{profile.name}</span>.
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-medium mb-4 max-w-xl">
              {profile.title}
            </p>

            <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-xl">
              {profile.tagline || profile.bio}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                className="px-6 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>View Projects</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3 text-sm font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Get in Touch</span>
                <Mail className="w-4 h-4 text-slate-400" />
              </a>

              <button
                onClick={onOpenResume}
                className="px-5 py-3 text-sm font-medium text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Resume / CV</span>
              </button>
            </div>

            {/* Social Links & Location */}
            <div className="flex items-center gap-6 text-sm text-slate-400 pt-6 border-t border-white/10 w-full">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">{profile.email}</span>
                  <span className="sm:hidden">Email</span>
                </a>
              )}
            </div>

          </div>

          {/* Right Column: Visual Frame & Portrait */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80 md:w-96 aspect-square">
              
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/30 to-blue-600/10 blur-xl opacity-70 transform rotate-3" />

              {/* Card Container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/15 bg-slate-900 shadow-2xl">
                <img
                  src={profile.avatarUrl || '/src/assets/images/estiak_portrait_1790980564550.jpg'}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Subtle scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Tech Badges (Architectural accent) */}
              <div className="absolute -bottom-4 -left-4 px-3.5 py-2 rounded-xl bg-[#0d1424]/90 border border-white/15 shadow-xl backdrop-blur-md flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-medium text-slate-200">Full-Stack MERN</span>
              </div>

              <div className="absolute -top-3 -right-3 px-3.5 py-1.5 rounded-xl bg-[#0d1424]/90 border border-white/15 shadow-xl backdrop-blur-md flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-medium text-slate-200">Node.js · MongoDB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quantified Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-white/[0.08]">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {profile.yearsExperience}+
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Years Experience
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {profile.completedProjects}+
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Projects Completed
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {profile.happyClients}+
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Happy Clients & Teams
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tabular-nums">
              99.9%
            </div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
              Reliable Code Delivery
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
