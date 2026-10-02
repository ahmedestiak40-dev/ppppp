import { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import { Project } from '../types/portfolio.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0b101d] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Frame */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-6 border border-white/10 relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="text-cyan-400 font-semibold">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>Order #{project.order}</span>
          {project.featured && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">Featured Architecture</span>
            </>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {project.title}
        </h3>

        <p className="text-base text-slate-300 mb-6 leading-relaxed">
          {project.tagline}
        </p>

        {/* Full narrative */}
        <div className="space-y-4 mb-6 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
          <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            System & Implementation Details
          </h4>
          <p>{project.longDescription || project.description}</p>
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mb-6 border-t border-white/10 pt-4">
            <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-3">
              Key Engineering Milestones
            </h4>
            <div className="space-y-2">
              {project.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies (Clean unboxed text metadata) */}
        <div className="border-t border-white/10 pt-4 mb-8">
          <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2">
            Technologies Applied
          </h4>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-mono">
            {project.technologies.map((t, idx) => (
              <span key={idx}>
                {t}
                {idx < project.technologies.length - 1 && <span className="text-slate-600 ml-2">/</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <span>Live Demonstration</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors flex items-center gap-2"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Repository</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
