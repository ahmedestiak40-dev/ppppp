import { useState, useEffect } from 'react';
import { 
  X, Lock, LogOut, LayoutDashboard, User, FolderKanban, Cpu, 
  Briefcase, Mail, Database, Plus, Trash2, Edit2, Check, AlertTriangle, 
  ExternalLink, Download, Upload, RefreshCw
} from 'lucide-react';
import { PortfolioData, Project, Skill, Experience, Message, Profile, DbStatus } from '../../types/portfolio.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onDataUpdated: (newData: PortfolioData) => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  onLoginStateChange: (loggedIn: boolean) => void;
}

export function AdminDashboard({
  isOpen,
  onClose,
  data,
  onDataUpdated,
  showToast,
  onLoginStateChange
}: AdminDashboardProps) {
  const [token, setToken] = useState<string>(() => localStorage.getItem('estiak_admin_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'projects' | 'skills' | 'experience' | 'messages' | 'database'>('overview');
  
  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<Profile>(data.profile);

  // Project edit state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Skill edit state
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);

  // Experience edit state
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  // Sync profileForm when data changes
  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  useEffect(() => {
    onLoginStateChange(Boolean(token));
  }, [token, onLoginStateChange]);

  // Load messages when authenticated and tab active
  useEffect(() => {
    if (token && (activeTab === 'messages' || activeTab === 'overview')) {
      fetchMessages();
    }
  }, [token, activeTab]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const result = await res.json();
      if (res.ok && result.token) {
        setToken(result.token);
        localStorage.setItem('estiak_admin_token', result.token);
        setPasswordInput('');
        showToast('success', 'Admin access verified! Welcome Estiak.');
      } else {
        setLoginError(result.error || 'Invalid password.');
      }
    } catch (err: any) {
      setLoginError('Server authentication error');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('estiak_admin_token');
    showToast('info', 'Logged out from Admin CMS.');
  };

  // ---------------- PROFILE ACTIONS ----------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      const result = await res.json();
      if (res.ok && result.profile) {
        onDataUpdated({ ...data, profile: result.profile });
        showToast('success', 'Profile information updated successfully.');
      } else {
        showToast('error', result.error || 'Failed to update profile.');
      }
    } catch (err) {
      showToast('error', 'Error updating profile');
    }
  };

  // ---------------- PROJECT ACTIONS ----------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const url = isNewProject ? '/api/projects' : `/api/projects/${editingProject.id}`;
      const method = isNewProject ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });

      const result = await res.json();
      if (res.ok && result.project) {
        let updatedProjects = [...data.projects];
        if (isNewProject) {
          updatedProjects.push(result.project);
        } else {
          updatedProjects = updatedProjects.map(p => p.id === result.project.id ? result.project : p);
        }
        onDataUpdated({ ...data, projects: updatedProjects });
        setEditingProject(null);
        setIsNewProject(false);
        showToast('success', `Project "${result.project.title}" saved.`);
      } else {
        showToast('error', result.error || 'Failed to save project.');
      }
    } catch (err) {
      showToast('error', 'Error saving project');
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove project "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = data.projects.filter(p => p.id !== id);
        onDataUpdated({ ...data, projects: updated });
        showToast('success', `Project "${title}" deleted.`);
      }
    } catch (err) {
      showToast('error', 'Failed to delete project');
    }
  };

  // ---------------- SKILL ACTIONS ----------------
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      const url = isNewSkill ? '/api/skills' : `/api/skills/${editingSkill.id}`;
      const method = isNewSkill ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingSkill)
      });

      const result = await res.json();
      if (res.ok && result.skill) {
        let updated = [...data.skills];
        if (isNewSkill) {
          updated.push(result.skill);
        } else {
          updated = updated.map(s => s.id === result.skill.id ? result.skill : s);
        }
        onDataUpdated({ ...data, skills: updated });
        setEditingSkill(null);
        setIsNewSkill(false);
        showToast('success', `Skill "${result.skill.name}" saved.`);
      }
    } catch (err) {
      showToast('error', 'Error saving skill');
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = data.skills.filter(s => s.id !== id);
        onDataUpdated({ ...data, skills: updated });
        showToast('success', `Skill deleted.`);
      }
    } catch (err) {
      showToast('error', 'Failed to delete skill');
    }
  };

  // ---------------- EXPERIENCE ACTIONS ----------------
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    try {
      const url = isNewExp ? '/api/experiences' : `/api/experiences/${editingExp.id}`;
      const method = isNewExp ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingExp)
      });

      const result = await res.json();
      if (res.ok && result.experience) {
        let updated = [...data.experiences];
        if (isNewExp) {
          updated.push(result.experience);
        } else {
          updated = updated.map(ex => ex.id === result.experience.id ? result.experience : ex);
        }
        onDataUpdated({ ...data, experiences: updated });
        setEditingExp(null);
        setIsNewExp(false);
        showToast('success', `Timeline item saved.`);
      }
    } catch (err) {
      showToast('error', 'Error saving timeline entry');
    }
  };

  const handleDeleteExp = async (id: string, role: string) => {
    if (!confirm(`Delete "${role}" entry?`)) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = data.experiences.filter(e => e.id !== id);
        onDataUpdated({ ...data, experiences: updated });
        showToast('success', `Timeline entry removed.`);
      }
    } catch (err) {
      showToast('error', 'Failed to delete entry');
    }
  };

  // ---------------- MESSAGE ACTIONS ----------------
  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.filter(m => m.id !== id));
      showToast('info', 'Message deleted.');
    } catch (err) {
      showToast('error', 'Failed to delete message');
    }
  };

  // ---------------- DATA BACKUP & RESTORE ----------------
  const handleExportData = async () => {
    try {
      const res = await fetch('/api/admin/export', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const exportJson = await res.json();
      const blob = new Blob([JSON.stringify(exportJson, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estiak_portfolio_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Backup JSON downloaded.');
    } catch (err) {
      showToast('error', 'Export failed');
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('WARNING: Reset all portfolio content to factory defaults? Any custom edits will be reverted.')) return;
    try {
      const res = await fetch('/api/admin/reset-defaults', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok && result.data) {
        onDataUpdated(result.data);
        showToast('success', 'Portfolio data reset to default seed state.');
      }
    } catch (err) {
      showToast('error', 'Reset failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#080d19] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Estiak Portfolio CMS & Admin Panel
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Full-Stack Node.js · Express · MongoDB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!token ? (
          /* LOGIN SCREEN */
          <div className="flex-1 flex items-center justify-center p-6">
            <form 
              onSubmit={handleLogin}
              className="w-full max-w-sm p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">
                Administrator Authentication
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Enter your admin password or PIN to manage content, projects, and database settings.
              </p>

              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Password (default: admin123)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 text-center"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-rose-400">{loginError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow"
                >
                  Unlock Admin Dashboard
                </button>

                <p className="text-[11px] text-slate-500 font-mono">
                  Default passcode is <code className="text-cyan-400">admin123</code> (customizable via ADMIN_PASSWORD)
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED CMS INTERFACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.01] p-4 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile Info</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Projects ({data.projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Skills ({data.skills.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'experience'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Timeline ({data.experiences.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'messages'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4" />
                  <span>Inquiries</span>
                </div>
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>

              <div className="hidden md:block my-2 border-t border-white/10" />

              <button
                onClick={() => setActiveTab('database')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left whitespace-nowrap ${
                  activeTab === 'database'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>MongoDB & VS Code</span>
              </button>
            </aside>

            {/* Main Tab Panels */}
            <main className="flex-1 p-6 overflow-y-auto">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">System Overview</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Live status of your full-stack portfolio backend, MongoDB database layer, and content.
                    </p>
                  </div>

                  {/* Database Banner */}
                  <div className={`p-5 rounded-2xl border ${
                    data.dbStatus?.connected 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100' 
                      : 'bg-amber-950/20 border-amber-500/30 text-amber-100'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Database className={`w-5 h-5 ${data.dbStatus?.connected ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <h4 className="text-sm font-semibold">
                        Database Mode: {data.dbStatus?.type || 'Local JSON Store (MongoDB ready)'}
                      </h4>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed mb-3">
                      {data.dbStatus?.message || 'Operating on local JSON file store. Connect to MongoDB anytime by specifying MONGODB_URI in your .env file.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('database')}
                      className="text-xs font-medium underline hover:opacity-100"
                    >
                      View MongoDB Setup Instructions & Data Migration →
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-2xl font-bold text-white font-mono">{data.projects.length}</div>
                      <div className="text-xs text-slate-400 mt-1">Live Projects</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-2xl font-bold text-white font-mono">{data.skills.length}</div>
                      <div className="text-xs text-slate-400 mt-1">Tech Skills</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-2xl font-bold text-white font-mono">{data.experiences.length}</div>
                      <div className="text-xs text-slate-400 mt-1">Timeline Items</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="text-2xl font-bold text-cyan-400 font-mono">
                        {messages.filter(m => !m.read).length}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Unread Inquiries</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                      Quick Content Management
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setEditingProject({
                            id: 'proj-' + Date.now(),
                            title: '',
                            tagline: '',
                            description: '',
                            category: 'Full-Stack',
                            technologies: ['React', 'Node.js', 'MongoDB'],
                            imageUrl: '/src/assets/images/project_ecommerce_platform_1790980576870.jpg',
                            liveUrl: '',
                            githubUrl: '',
                            featured: false,
                            order: data.projects.length + 1
                          });
                          setIsNewProject(true);
                          setActiveTab('projects');
                        }}
                        className="px-3.5 py-2 text-xs font-medium rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Project</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('profile')}
                        className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Edit Bio & Headline</span>
                      </button>

                      <button
                        onClick={handleExportData}
                        className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Backup JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFILE EDITOR */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Edit Profile Information</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Update your public name, headline, bio, contact coordinates, and portfolio stats.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Professional Title</label>
                      <input
                        type="text"
                        required
                        value={profileForm.title}
                        onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Hero Tagline</label>
                    <input
                      type="text"
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Bio / Overview</label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Phone</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Avatar / Photo URL</label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Years Experience</label>
                      <input
                        type="number"
                        value={profileForm.yearsExperience}
                        onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Projects Delivered</label>
                      <input
                        type="number"
                        value={profileForm.completedProjects}
                        onChange={(e) => setProfileForm({ ...profileForm, completedProjects: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Happy Clients</label>
                      <input
                        type="number"
                        value={profileForm.happyClients}
                        onChange={(e) => setProfileForm({ ...profileForm, happyClients: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Projects Manager</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Add, edit, and organize portfolio showcase applications.
                      </p>
                    </div>

                    {!editingProject && (
                      <button
                        onClick={() => {
                          setEditingProject({
                            id: 'proj-' + Date.now(),
                            title: '',
                            tagline: '',
                            description: '',
                            category: 'Full-Stack',
                            technologies: ['React', 'Node.js', 'MongoDB'],
                            imageUrl: '/src/assets/images/project_ecommerce_platform_1790980576870.jpg',
                            liveUrl: '',
                            githubUrl: '',
                            featured: false,
                            order: data.projects.length + 1
                          });
                          setIsNewProject(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>

                  {editingProject ? (
                    /* Project Edit Form */
                    <form onSubmit={handleSaveProject} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-white">
                          {isNewProject ? 'Create New Project' : `Edit: ${editingProject.title}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="Full-Stack">Full-Stack</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend & API">Backend & API</option>
                            <option value="Mobile">Mobile</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Tagline</label>
                        <input
                          type="text"
                          value={editingProject.tagline}
                          onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-y"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Technologies (comma separated)</label>
                          <input
                            type="text"
                            value={editingProject.technologies.join(', ')}
                            onChange={(e) => setEditingProject({ 
                              ...editingProject, 
                              technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                            })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Image URL</label>
                          <input
                            type="text"
                            value={editingProject.imageUrl}
                            onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Live URL</label>
                          <input
                            type="text"
                            value={editingProject.liveUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Repo URL</label>
                          <input
                            type="text"
                            value={editingProject.githubUrl || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="featuredProj"
                          checked={editingProject.featured}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-cyan-400 focus:ring-0"
                        />
                        <label htmlFor="featuredProj" className="text-xs text-slate-300">
                          Feature this project prominently
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl"
                        >
                          Save Project
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Project List */
                    <div className="space-y-3">
                      {data.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                              <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">{proj.title}</div>
                              <div className="text-xs text-slate-400">
                                {proj.category} · {proj.technologies.slice(0, 3).join(', ')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProject(proj);
                                setIsNewProject(false);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Skills & Technologies</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Manage your tech stack and proficiency ratings.
                      </p>
                    </div>

                    {!editingSkill && (
                      <button
                        onClick={() => {
                          setEditingSkill({
                            id: 'sk-' + Date.now(),
                            name: '',
                            category: 'Frontend',
                            proficiency: 85
                          });
                          setIsNewSkill(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>

                  {editingSkill ? (
                    <form onSubmit={handleSaveSkill} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h4 className="text-sm font-bold text-white">
                        {isNewSkill ? 'Add New Skill' : `Edit: ${editingSkill.name}`}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Skill Name *</label>
                          <input
                            type="text"
                            required
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                          <select
                            value={editingSkill.category}
                            onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend & Database">Backend & Database</option>
                            <option value="DevOps & Tools">DevOps & Tools</option>
                            <option value="Architecture">Architecture</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                          <span>Proficiency</span>
                          <span>{editingSkill.proficiency}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={editingSkill.proficiency}
                          onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value, 10) })}
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditingSkill(null)}
                          className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl"
                        >
                          Save Skill
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{skill.name}</div>
                            <div className="text-[11px] text-slate-400">{skill.category} · {skill.proficiency}%</div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingSkill(skill);
                                setIsNewSkill(false);
                              }}
                              className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Experience & Education</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Curate your professional journey, companies, and degrees.
                      </p>
                    </div>

                    {!editingExp && (
                      <button
                        onClick={() => {
                          setEditingExp({
                            id: 'exp-' + Date.now(),
                            role: '',
                            company: '',
                            period: '',
                            description: '',
                            highlights: [],
                            type: 'work',
                            order: data.experiences.length + 1
                          });
                          setIsNewExp(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Entry</span>
                      </button>
                    )}
                  </div>

                  {editingExp ? (
                    <form onSubmit={handleSaveExp} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <h4 className="text-sm font-bold text-white">
                        {isNewExp ? 'Add Timeline Entry' : `Edit: ${editingExp.role}`}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Role / Degree Title *</label>
                          <input
                            type="text"
                            required
                            value={editingExp.role}
                            onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Company / Institution *</label>
                          <input
                            type="text"
                            required
                            value={editingExp.company}
                            onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Period (e.g. 2023 - Present)</label>
                          <input
                            type="text"
                            value={editingExp.period}
                            onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Type</label>
                          <select
                            value={editingExp.type}
                            onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value as any })}
                            className="w-full px-3 py-2 text-sm rounded-xl bg-[#0a0f1d] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          >
                            <option value="work">Professional Experience (Work)</option>
                            <option value="education">Academic Education</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Summary Description</label>
                        <textarea
                          rows={3}
                          value={editingExp.description}
                          onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Key Highlights (one per line)</label>
                        <textarea
                          rows={3}
                          value={editingExp.highlights?.join('\n') || ''}
                          onChange={(e) => setEditingExp({ 
                            ...editingExp, 
                            highlights: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) 
                          })}
                          placeholder="Reduced API latency by 40%&#10;Built real-time messaging pipeline"
                          className="w-full px-3 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-cyan-400 resize-y"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditingExp(null)}
                          className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl"
                        >
                          Save Entry
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {data.experiences.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {exp.role} · <span className="text-slate-400 font-normal">{exp.company}</span>
                            </div>
                            <div className="text-xs text-cyan-400 font-mono">
                              {exp.period} · {exp.type}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingExp(exp);
                                setIsNewExp(false);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExp(exp.id, exp.role)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: MESSAGES & INQUIRIES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display">Client Inquiries & Messages</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Submissions received directly from the contact form.
                      </p>
                    </div>

                    <button
                      onClick={fetchMessages}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-16 text-slate-500 text-xs">
                      No contact messages received yet. Submit a test inquiry via the public contact form!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            msg.read
                              ? 'bg-white/[0.015] border-white/[0.08]'
                              : 'bg-cyan-500/[0.04] border-cyan-500/30'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-sm">{msg.name}</span>
                              <span className="text-xs text-slate-400 font-mono">&lt;{msg.email}&gt;</span>
                              {!msg.read && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-slate-300 mb-2">
                            Subject: {msg.subject}
                          </div>

                          <p className="text-xs text-slate-300 bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed whitespace-pre-wrap mb-4">
                            {msg.message}
                          </p>

                          <div className="flex items-center justify-end gap-3 text-xs">
                            {!msg.read && (
                              <button
                                onClick={() => handleMarkRead(msg.id)}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                              >
                                Mark as Read
                              </button>
                            )}

                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="px-3 py-1.5 rounded-lg bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/30 transition-colors"
                            >
                              Reply via Email
                            </a>

                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: DATABASE & VS CODE GUIDE */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      MongoDB & Local VS Code Integration Guide
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Everything needed to run this project in your laptop's VS Code studio with MongoDB.
                    </p>
                  </div>

                  {/* Dual Architecture Explanation */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span>How the Dual Database Architecture Works</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      This application has a built-in hybrid repository designed for seamless development:
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-2">
                      <li>
                        <strong className="text-white">With MongoDB:</strong> When <code className="text-cyan-300">MONGODB_URI</code> is specified in <code className="text-cyan-300">.env</code>, it connects via Mongoose to your local MongoDB or MongoDB Atlas cluster.
                      </li>
                      <li>
                        <strong className="text-white">Without MongoDB (Resilient Fallback):</strong> If MongoDB is offline or URI is omitted, it automatically persists to <code className="text-cyan-300">./data/portfolio.json</code> without any crashes!
                      </li>
                    </ul>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-sm font-semibold text-white">
                      Step-by-Step: Running in VS Code on your Laptop
                    </h4>

                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                        <div className="text-slate-400">// 1. Clone or copy project to your machine</div>
                        <div className="text-cyan-300 mt-1">cd estiak-portfolio</div>
                        <div className="text-cyan-300">npm install</div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                        <div className="text-slate-400">// 2. Create your .env file in the root folder</div>
                        <div className="text-slate-300 mt-1">MONGODB_URI=mongodb://localhost:27017/estiak_portfolio</div>
                        <div className="text-slate-300">ADMIN_PASSWORD=admin123</div>
                        <div className="text-slate-300">PORT=3000</div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                        <div className="text-slate-400">// 3. Start local MongoDB (or use MongoDB Atlas cloud URI)</div>
                        <div className="text-emerald-400 mt-1">mongod</div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                        <div className="text-slate-400">// 4. Run the full-stack development server</div>
                        <div className="text-cyan-300 mt-1">npm run dev</div>
                        <div className="text-slate-400 mt-1">// Server will boot on http://localhost:3000</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Backup & Restore Controls */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-sm font-semibold text-white">
                      Backup, Restore & Reset
                    </h4>
                    <p className="text-xs text-slate-400">
                      Export your entire portfolio content as a single JSON file to migrate to your local MongoDB database or reset to clean defaults.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Full Database (JSON)</span>
                      </button>

                      <button
                        onClick={handleResetDefaults}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Initial Seed Defaults</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>
        )}

      </div>
    </div>
  );
}
