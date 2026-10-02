import { useEffect } from 'react';
import { X, Printer, Download, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { PortfolioData } from '../types/portfolio.ts';

interface ResumeModalProps {
  data: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ data, isOpen, onClose }: ResumeModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { profile, projects, skills, experiences } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0a0f1d] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-10 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <div className="text-xs font-mono text-cyan-400">
            Official Curriculum Vitae (Print & Export Ready)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable CV Document Layout */}
        <div className="space-y-8 bg-white/[0.01] p-6 rounded-2xl border border-white/5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-display">
                {profile.name}
              </h1>
              <p className="text-base text-cyan-300 font-medium mt-1">
                {profile.title}
              </p>
            </div>

            <div className="flex flex-col gap-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {profile.email}
              </span>
              {profile.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {profile.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {profile.location}
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2">
              Professional Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-3">
              Core Technical Competencies
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {skills.map((s) => (
                <span 
                  key={s.id}
                  className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-300"
                >
                  {s.name} ({s.proficiency}%)
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-4">
              Work History & Experience
            </h2>
            <div className="space-y-6">
              {experiences.filter(e => e.type === 'work').map((exp) => (
                <div key={exp.id} className="border-l-2 border-cyan-500/40 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-white">
                      {exp.role} · <span className="text-slate-400 font-normal">{exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-cyan-400">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-4">
              Highlighted Project Deployments
            </h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                    <span className="text-xs font-mono text-slate-400">{proj.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{proj.description}</p>
                  <div className="text-[11px] text-cyan-400/90 font-mono">
                    Technologies: {proj.technologies.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-3">
              Education & Degrees
            </h2>
            <div className="space-y-3">
              {experiences.filter(e => e.type === 'education').map((edu) => (
                <div key={edu.id} className="border-l-2 border-blue-500/40 pl-4">
                  <div className="flex justify-between items-center text-sm font-bold text-white">
                    <span>{edu.role}</span>
                    <span className="text-xs font-mono text-blue-400 font-normal">{edu.period}</span>
                  </div>
                  <div className="text-xs text-slate-400">{edu.company}</div>
                  <p className="text-xs text-slate-300 mt-1">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
