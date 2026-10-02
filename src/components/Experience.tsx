import { Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Experience } from '../types/portfolio.ts';

interface ExperienceProps {
  experiences: Experience[];
  isAdminLoggedIn: boolean;
  onEditExperience?: (exp: Experience) => void;
  onAddNewExperience?: () => void;
}

export function ExperienceSection({ 
  experiences, 
  isAdminLoggedIn, 
  onEditExperience,
  onAddNewExperience 
}: ExperienceProps) {
  const workItems = experiences.filter(e => e.type === 'work');
  const eduItems = experiences.filter(e => e.type === 'education');

  return (
    <section id="experience" className="py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              04. Journey & Track Record
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Experience & Education
            </h2>
          </div>

          {isAdminLoggedIn && onAddNewExperience && (
            <button
              onClick={onAddNewExperience}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              + Add Timeline Entry
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Work History */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Professional Experience
              </h3>
            </div>

            <div className="relative pl-6 border-l border-white/10 space-y-10">
              {workItems.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#080c14] border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-xs font-mono text-cyan-400 font-medium">
                      {item.period}
                    </span>
                    {isAdminLoggedIn && onEditExperience && (
                      <button
                        onClick={() => onEditExperience(item)}
                        className="text-xs text-slate-400 hover:text-cyan-300 underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.role}
                  </h4>

                  <div className="text-xs font-medium text-slate-400 mb-3">
                    {item.company}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Qualifications */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Academic Background
              </h3>
            </div>

            <div className="relative pl-6 border-l border-white/10 space-y-10">
              {eduItems.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#080c14] border-2 border-blue-400 group-hover:scale-125 transition-transform" />

                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="text-xs font-mono text-blue-400 font-medium">
                      {item.period}
                    </span>
                    {isAdminLoggedIn && onEditExperience && (
                      <button
                        onClick={() => onEditExperience(item)}
                        className="text-xs text-slate-400 hover:text-cyan-300 underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.role}
                  </h4>

                  <div className="text-xs font-medium text-slate-400 mb-3">
                    {item.company}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
