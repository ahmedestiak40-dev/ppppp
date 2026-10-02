import { MapPin, Mail, Phone, Code, Database, Cpu, CheckCircle } from 'lucide-react';
import { Profile } from '../types/portfolio.ts';

interface AboutProps {
  profile: Profile;
  onOpenResume?: () => void;
}

export function About({ profile, onOpenResume }: AboutProps) {
  const principles = [
    {
      title: "Full-Stack System Architecture",
      desc: "Designing end-to-end applications with robust Node.js backend logic, clean API contracts, and responsive React component hierarchies."
    },
    {
      title: "Data Modeling & Aggregation",
      desc: "Optimizing MongoDB schemas, indexing strategies, and transactional queries for high-concurrency and sub-second latencies."
    },
    {
      title: "Production-First Mindset",
      desc: "Writing clean, maintainable, and type-safe TypeScript code with comprehensive error handling and logging."
    }
  ];

  return (
    <section id="about" className="py-20 border-b border-white/[0.06] bg-[#0a0f1d]/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
            01. Background & Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Story & Principles */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-slate-300 leading-relaxed">
            <p className="text-lg text-slate-200">
              {profile.bio}
            </p>

            <p className="text-base text-slate-400">
              I believe great software is born at the intersection of rigorous backend architecture and meticulous user experience. Whether working independently or as part of a high-velocity agile team, I take pride in delivering resilient applications from database conception all the way to deployment.
            </p>

            {/* Architectural Principles */}
            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Core Engineering Standards
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {principles.map((p, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5 hover:border-cyan-500/20 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{p.title}</h4>
                      <p className="text-xs text-slate-400 leading-normal">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info & Highlights Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Quick Snapshot</span>
              </h3>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Location
                  </span>
                  <span className="font-medium text-slate-200">{profile.location}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Email
                  </span>
                  <a href={`mailto:${profile.email}`} className="font-medium text-cyan-400 hover:underline">
                    {profile.email}
                  </a>
                </div>

                {profile.phone && (
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Phone
                    </span>
                    <span className="font-medium text-slate-200">{profile.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-500" />
                    Database Stack
                  </span>
                  <span className="font-medium text-slate-200">MongoDB / Mongoose</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-slate-500" />
                    Primary Frameworks
                  </span>
                  <span className="font-medium text-slate-200">React.js · Node.js</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4">
                <button
                  onClick={onOpenResume}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow text-center"
                >
                  Download / View Complete Resume
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
