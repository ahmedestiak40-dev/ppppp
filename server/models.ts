import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  bio: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  resumeUrl: { type: String, default: '#' },
  avatarUrl: { type: String, default: '' },
  availabilityStatus: { type: String, default: 'Available for work' },
  yearsExperience: { type: Number, default: 4 },
  completedProjects: { type: Number, default: 25 },
  happyClients: { type: Number, default: 15 },
}, { timestamps: true });

const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  category: { type: String, required: true },
  technologies: { type: [String], default: [] },
  imageUrl: { type: String, required: true },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  highlights: { type: [String], default: [] },
}, { timestamps: true });

const SkillSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, required: true, min: 0, max: 100 },
  iconName: { type: String, default: '' },
}, { timestamps: true });

const ExperienceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true },
  highlights: { type: [String], default: [] },
  type: { type: String, enum: ['work', 'education'], default: 'work' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const MessageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
}, { timestamps: true });

export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
