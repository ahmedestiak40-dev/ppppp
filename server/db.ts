import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { defaultPortfolioData } from '../src/data/defaultData.ts';
import { PortfolioData, Project, Skill, Experience, Message, Profile, DbStatus } from '../src/types/portfolio.ts';
import { ProfileModel, ProjectModel, SkillModel, ExperienceModel, MessageModel } from './models.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');

// Memory cache & persistence state
let isMongoConnected = false;
let currentDbName = '';
let connectionErrorMsg = '';
let cachedData: PortfolioData & { messages?: Message[] } = {
  ...defaultPortfolioData,
  messages: []
};

// Ensure data folder and local json file exists
function ensureLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(cachedData, null, 2), 'utf-8');
    } else {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      cachedData = JSON.parse(raw);
    }
  } catch (err) {
    console.error('[Store] Error ensuring local data storage:', err);
  }
}

function saveLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(cachedData, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Failed to write local JSON store:', err);
  }
}

// Initialize database connection
export async function initDatabase(): Promise<DbStatus> {
  ensureLocalStore();
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`[MongoDB] Connecting to MongoDB instance...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000
      });
      isMongoConnected = true;
      currentDbName = mongoose.connection.name || 'estiak_portfolio';
      console.log(`[MongoDB] Successfully connected to database: ${currentDbName}`);

      // Seed data into MongoDB if collections are empty
      await seedMongoIfEmpty();

      return {
        connected: true,
        type: 'MongoDB',
        uriConfigured: true,
        databaseName: currentDbName,
        message: `Connected to MongoDB database "${currentDbName}"`
      };
    } catch (err: any) {
      isMongoConnected = false;
      connectionErrorMsg = err?.message || 'Connection failed';
      console.warn(`[MongoDB] Could not connect to MongoDB (${connectionErrorMsg}). Gracefully using local JSON storage.`);
    }
  } else {
    console.log(`[Database] MONGODB_URI not provided. Running in resilient Local JSON storage mode.`);
  }

  return {
    connected: false,
    type: 'Local JSON Store (MongoDB ready)',
    uriConfigured: Boolean(uri),
    message: uri 
      ? `Failed to connect to ${uri}: ${connectionErrorMsg}. Serving from local storage.`
      : 'Running in Local JSON mode. To use real MongoDB, configure MONGODB_URI in .env'
  };
}

async function seedMongoIfEmpty() {
  try {
    const projectCount = await ProjectModel.countDocuments();
    if (projectCount === 0) {
      console.log('[MongoDB] Seeding initial portfolio dataset into MongoDB collections...');
      await ProfileModel.deleteMany({});
      await ProfileModel.create(cachedData.profile);

      await ProjectModel.insertMany(cachedData.projects);
      await SkillModel.insertMany(cachedData.skills);
      await ExperienceModel.insertMany(cachedData.experiences);
      console.log('[MongoDB] Initial seed data successfully written to MongoDB.');
    }
  } catch (err) {
    console.error('[MongoDB] Error during initial seed check:', err);
  }
}

export function getDbStatus(): DbStatus {
  return {
    connected: isMongoConnected,
    type: isMongoConnected ? 'MongoDB' : 'Local JSON Store (MongoDB ready)',
    uriConfigured: Boolean(process.env.MONGODB_URI),
    databaseName: currentDbName,
    message: isMongoConnected
      ? `Active connection to MongoDB (${currentDbName})`
      : 'Operating on local JSON file store (MongoDB ready for local VS Code or Atlas)'
  };
}

// Data access operations
export async function getPortfolioData(): Promise<PortfolioData> {
  if (isMongoConnected) {
    try {
      const profileDoc = await ProfileModel.findOne().lean();
      const projects = await ProjectModel.find().sort({ order: 1 }).lean();
      const skills = await SkillModel.find().lean();
      const experiences = await ExperienceModel.find().sort({ order: 1 }).lean();

      return {
        profile: (profileDoc as any) || cachedData.profile,
        projects: (projects as any) || cachedData.projects,
        skills: (skills as any) || cachedData.skills,
        experiences: (experiences as any) || cachedData.experiences,
        dbStatus: getDbStatus()
      };
    } catch (err) {
      console.error('[MongoDB] Error reading data, falling back to cache:', err);
    }
  }

  return {
    profile: cachedData.profile,
    projects: cachedData.projects,
    skills: cachedData.skills,
    experiences: cachedData.experiences,
    dbStatus: getDbStatus()
  };
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  cachedData.profile = { ...cachedData.profile, ...data };
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ProfileModel.findOneAndUpdate({}, cachedData.profile, { upsert: true, new: true });
    } catch (err) {
      console.error('[MongoDB] Error updating profile:', err);
    }
  }

  return cachedData.profile;
}

export async function saveProject(project: Project): Promise<Project> {
  const existingIdx = cachedData.projects.findIndex(p => p.id === project.id);
  if (existingIdx >= 0) {
    cachedData.projects[existingIdx] = project;
  } else {
    cachedData.projects.push(project);
  }
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ProjectModel.findOneAndUpdate(
        { id: project.id },
        project,
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('[MongoDB] Error saving project:', err);
    }
  }

  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  cachedData.projects = cachedData.projects.filter(p => p.id !== id);
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ProjectModel.deleteOne({ id });
    } catch (err) {
      console.error('[MongoDB] Error deleting project:', err);
    }
  }

  return true;
}

export async function saveSkill(skill: Skill): Promise<Skill> {
  const existingIdx = cachedData.skills.findIndex(s => s.id === skill.id);
  if (existingIdx >= 0) {
    cachedData.skills[existingIdx] = skill;
  } else {
    cachedData.skills.push(skill);
  }
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await SkillModel.findOneAndUpdate({ id: skill.id }, skill, { upsert: true, new: true });
    } catch (err) {
      console.error('[MongoDB] Error saving skill:', err);
    }
  }

  return skill;
}

export async function deleteSkill(id: string): Promise<boolean> {
  cachedData.skills = cachedData.skills.filter(s => s.id !== id);
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await SkillModel.deleteOne({ id });
    } catch (err) {
      console.error('[MongoDB] Error deleting skill:', err);
    }
  }

  return true;
}

export async function saveExperience(exp: Experience): Promise<Experience> {
  const existingIdx = cachedData.experiences.findIndex(e => e.id === exp.id);
  if (existingIdx >= 0) {
    cachedData.experiences[existingIdx] = exp;
  } else {
    cachedData.experiences.push(exp);
  }
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ExperienceModel.findOneAndUpdate({ id: exp.id }, exp, { upsert: true, new: true });
    } catch (err) {
      console.error('[MongoDB] Error saving experience:', err);
    }
  }

  return exp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  cachedData.experiences = cachedData.experiences.filter(e => e.id !== id);
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ExperienceModel.deleteOne({ id });
    } catch (err) {
      console.error('[MongoDB] Error deleting experience:', err);
    }
  }

  return true;
}

export async function getMessages(): Promise<Message[]> {
  if (isMongoConnected) {
    try {
      const msgs = await MessageModel.find().sort({ createdAt: -1 }).lean();
      return (msgs as any) || [];
    } catch (err) {
      console.error('[MongoDB] Error fetching messages:', err);
    }
  }
  return cachedData.messages || [];
}

export async function saveMessage(msg: Message): Promise<Message> {
  if (!cachedData.messages) cachedData.messages = [];
  cachedData.messages.unshift(msg);
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await MessageModel.create(msg);
    } catch (err) {
      console.error('[MongoDB] Error saving message:', err);
    }
  }

  return msg;
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (cachedData.messages) {
    cachedData.messages = cachedData.messages.filter(m => m.id !== id);
    saveLocalStore();
  }

  if (isMongoConnected) {
    try {
      await MessageModel.deleteOne({ id });
    } catch (err) {
      console.error('[MongoDB] Error deleting message:', err);
    }
  }

  return true;
}

export async function markMessageRead(id: string): Promise<boolean> {
  if (cachedData.messages) {
    const msg = cachedData.messages.find(m => m.id === id);
    if (msg) msg.read = true;
    saveLocalStore();
  }

  if (isMongoConnected) {
    try {
      await MessageModel.updateOne({ id }, { read: true });
    } catch (err) {
      console.error('[MongoDB] Error marking message read:', err);
    }
  }

  return true;
}

export async function resetToDefaults(): Promise<PortfolioData> {
  cachedData = {
    ...defaultPortfolioData,
    messages: []
  };
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ProfileModel.deleteMany({});
      await ProjectModel.deleteMany({});
      await SkillModel.deleteMany({});
      await ExperienceModel.deleteMany({});
      await MessageModel.deleteMany({});

      await ProfileModel.create(defaultPortfolioData.profile);
      await ProjectModel.insertMany(defaultPortfolioData.projects);
      await SkillModel.insertMany(defaultPortfolioData.skills);
      await ExperienceModel.insertMany(defaultPortfolioData.experiences);
    } catch (err) {
      console.error('[MongoDB] Error resetting data:', err);
    }
  }

  return getPortfolioData();
}

export function exportFullData() {
  return cachedData;
}

export async function importFullData(data: PortfolioData & { messages?: Message[] }) {
  cachedData = {
    profile: data.profile || defaultPortfolioData.profile,
    projects: data.projects || defaultPortfolioData.projects,
    skills: data.skills || defaultPortfolioData.skills,
    experiences: data.experiences || defaultPortfolioData.experiences,
    messages: data.messages || []
  };
  saveLocalStore();

  if (isMongoConnected) {
    try {
      await ProfileModel.deleteMany({});
      await ProjectModel.deleteMany({});
      await SkillModel.deleteMany({});
      await ExperienceModel.deleteMany({});

      await ProfileModel.create(cachedData.profile);
      await ProjectModel.insertMany(cachedData.projects);
      await SkillModel.insertMany(cachedData.skills);
      await ExperienceModel.insertMany(cachedData.experiences);
    } catch (err) {
      console.error('[MongoDB] Error importing data:', err);
    }
  }

  return getPortfolioData();
}
