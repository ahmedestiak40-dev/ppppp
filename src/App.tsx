import { useState, useEffect, useCallback } from 'react';
import { defaultPortfolioData } from './data/defaultData.ts';
import { PortfolioData, Project, Experience } from './types/portfolio.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Skills } from './components/Skills.tsx';
import { Projects } from './components/Projects.tsx';
import { ExperienceSection } from './components/Experience.tsx';
import { Contact } from './components/Contact.tsx';
import { Footer } from './components/Footer.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { ResumeModal } from './components/ResumeModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';

export default function App() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => Boolean(localStorage.getItem('estiak_admin_token')));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch portfolio data from Node.js Express Backend
  const loadPortfolioData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Backend API connection warning, utilizing local fallback data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolioData();
  }, [loadPortfolioData]);

  // Handle URL hash or direct admin access
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }
  }, []);

  const handleDataUpdated = (newData: PortfolioData) => {
    setData(newData);
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleOpenResume = () => {
    setIsResumeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar following 3-Zone Contract */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        dbStatus={data.dbStatus}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero 
          profile={data.profile} 
          onOpenResume={handleOpenResume} 
        />

        <About 
          profile={data.profile} 
          onOpenResume={handleOpenResume} 
        />

        <Skills 
          skills={data.skills} 
        />

        <Projects
          projects={data.projects}
          onSelectProject={(proj) => setSelectedProject(proj)}
          isAdminLoggedIn={isAdminLoggedIn}
          onEditProject={() => setIsAdminOpen(true)}
          onAddNewProject={() => setIsAdminOpen(true)}
        />

        <ExperienceSection
          experiences={data.experiences}
          isAdminLoggedIn={isAdminLoggedIn}
          onEditExperience={() => setIsAdminOpen(true)}
          onAddNewExperience={() => setIsAdminOpen(true)}
        />

        <Contact
          profile={data.profile}
          onMessageSent={() => showToast('success', 'Inquiry recorded to database!')}
        />
      </main>

      {/* Clean Footer */}
      <Footer 
        profile={data.profile} 
        onOpenAdmin={handleOpenAdmin} 
      />

      {/* Project Lightbox Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Structured Resume & CV Modal */}
      <ResumeModal
        data={data}
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Admin Dashboard CMS */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onDataUpdated={handleDataUpdated}
        showToast={showToast}
        onLoginStateChange={setIsAdminLoggedIn}
      />

      {/* Floating Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={dismissToast} 
      />
    </div>
  );
}
