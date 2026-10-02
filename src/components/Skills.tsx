import { useState } from 'react';
import { Layers, Terminal, Server, Cpu } from 'lucide-react';
import { Skill } from '../types/portfolio.ts';

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend & Database', 'DevOps & Tools', 'Architecture'];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              02. Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Skills & Expertise
            </h2>
          </div>

          {/* Interactive Category Segmented Tabs (Functional Buttons) */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    {skill.category === 'Frontend' && <Layers className="w-4 h-4" />}
                    {skill.category === 'Backend & Database' && <Server className="w-4 h-4" />}
                    {skill.category === 'DevOps & Tools' && <Terminal className="w-4 h-4" />}
                    {skill.category === 'Architecture' && <Cpu className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {skill.category}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-medium text-slate-400 tabular-nums">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Clean Progress Meter */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
