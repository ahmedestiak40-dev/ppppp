import { useState } from 'react';
import { ExternalLink, Github, ArrowRight, Edit3 } from 'lucide-react';
import { Project } from '../types/portfolio.ts';

interface ProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  isAdminLoggedIn: boolean;
  onEditProject?: (project: Project) => void;
  onAddNewProject?: () => void;
}

export function Projects({ 
  projects, 
  onSelectProject, 
  isAdminLoggedIn,
  onEditProject,
  onAddNewProject 
}: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend & API'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-20 border-b border-white/[0.06] bg-[#090e1a]/40">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              03. Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Featured Projects
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/10 rounded-xl overflow-x-auto">
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

            {isAdminLoggedIn && onAddNewProject && (
              <button
                onClick={onAddNewProject}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors whitespace-nowrap"
              >
                + New Project
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.035] transition-all duration-300 group"
            >
              {/* Media Container with Fallback */}
              <div 
                className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => onSelectProject(project)}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                
                {/* Fallback pattern underneath in case image fails */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent opacity-80" />

                {/* Category & Status Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                    {project.category}
                  </span>
                </div>

                {isAdminLoggedIn && onEditProject && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-black/70 hover:bg-cyan-500 text-white transition-colors border border-white/15"
                    title="Edit project in CMS"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                {/* Clean unboxed technologies with typographic separator */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-mono mb-3">
                  {project.technologies.slice(0, 4).map((tech, idx) => (
                    <span key={idx}>
                      {tech}
                      {idx < Math.min(3, project.technologies.length - 1) && (
                        <span className="text-slate-600 ml-1.5">·</span>
                      )}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-slate-500">+{project.technologies.length - 4}</span>
                  )}
                </div>

                <h3 
                  onClick={() => onSelectProject(project)}
                  className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display mb-2 cursor-pointer"
                >
                  {project.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1">
                  {project.tagline || project.description}
                </p>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
                  <button
                    onClick={() => onSelectProject(project)}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <span>Architecture & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-300 transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
