export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  twitter?: string;
  resumeUrl: string;
  avatarUrl: string;
  availabilityStatus: string;
  yearsExperience: number;
  completedProjects: number;
  happyClients: number;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend & API' | 'Mobile';
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  highlights?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend & Database' | 'DevOps & Tools' | 'Architecture';
  proficiency: number; // 0 - 100
  iconName?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  type: 'work' | 'education';
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied?: boolean;
}

export interface DbStatus {
  connected: boolean;
  type: 'MongoDB' | 'Local JSON Store (MongoDB ready)';
  uriConfigured: boolean;
  databaseName?: string;
  message: string;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  dbStatus?: DbStatus;
}
