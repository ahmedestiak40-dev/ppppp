import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getDbStatus,
  getPortfolioData,
  updateProfile,
  saveProject,
  deleteProject,
  saveSkill,
  deleteSkill,
  saveExperience,
  deleteExperience,
  getMessages,
  saveMessage,
  deleteMessage,
  markMessageRead,
  resetToDefaults,
  exportFullData,
  importFullData
} from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// JSON parsing middleware
app.use(express.json({ limit: '10mb' }));

// Simple Auth Middleware for Admin Routes
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Forbidden: Invalid admin credentials.' });
  }
  next();
};

// ---------------- PUBLIC API ENDPOINTS ----------------

// Get full portfolio data
app.get('/api/portfolio', async (_req: Request, res: Response) => {
  try {
    const data = await getPortfolioData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// Database status
app.get('/api/db-status', (_req: Request, res: Response) => {
  res.json(getDbStatus());
});

// Contact message submission
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and a message.' });
    }

    const newMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : 'Portfolio Inquiry',
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      read: false,
      replied: false,
    };

    const saved = await saveMessage(newMessage);
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: saved });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Admin login verification
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD, message: 'Admin access granted.' });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect admin password.' });
  }
});

// ---------------- ADMIN PROTECTED ENDPOINTS ----------------

// Update Profile
app.put('/api/profile', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await updateProfile(req.body);
    res.json({ success: true, profile: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Add / Update Project
app.post('/api/projects', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const project = req.body;
    if (!project.id) {
      project.id = 'proj-' + Date.now();
    }
    const saved = await saveProject(project);
    res.status(201).json({ success: true, project: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

app.put('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const project = { ...req.body, id: req.params.id };
    const saved = await saveProject(project);
    res.json({ success: true, project: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await deleteProject(req.params.id);
    res.json({ success: true, message: 'Project removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Skills management
app.post('/api/skills', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const skill = req.body;
    if (!skill.id) skill.id = 'sk-' + Date.now();
    const saved = await saveSkill(skill);
    res.status(201).json({ success: true, skill: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save skill' });
  }
});

app.put('/api/skills/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const skill = { ...req.body, id: req.params.id };
    const saved = await saveSkill(skill);
    res.json({ success: true, skill: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

app.delete('/api/skills/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await deleteSkill(req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Experiences management
app.post('/api/experiences', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const exp = req.body;
    if (!exp.id) exp.id = 'exp-' + Date.now();
    const saved = await saveExperience(exp);
    res.status(201).json({ success: true, experience: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save experience' });
  }
});

app.put('/api/experiences/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const exp = { ...req.body, id: req.params.id };
    const saved = await saveExperience(exp);
    res.json({ success: true, experience: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
});

app.delete('/api/experiences/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await deleteExperience(req.params.id);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Inquiries / Messages
app.get('/api/messages', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const msgs = await getMessages();
    res.json(msgs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.put('/api/messages/:id/read', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await markMessageRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

app.delete('/api/messages/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    await deleteMessage(req.params.id);
    res.json({ success: true, message: 'Message removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Admin data maintenance
app.post('/api/admin/reset-defaults', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const data = await resetToDefaults();
    res.json({ success: true, message: 'Data reset to defaults successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset defaults' });
  }
});

app.get('/api/admin/export', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(exportFullData());
});

app.post('/api/admin/import', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const data = await importFullData(req.body);
    res.json({ success: true, message: 'Data imported successfully', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import data' });
  }
});

// ---------------- SERVER STARTUP & VITE MOUNT ----------------

async function startServer() {
  await initDatabase();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Vite Dev Server Middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[Dev] Vite middleware attached in development mode');
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('[Warning] dist/ folder does not exist. Run "npm run build" first.');
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🚀 Estiak Ahmed Portfolio Server Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🔑 Admin PIN/Password: ${ADMIN_PASSWORD}`);
    console.log(`🗄️ Database Status: ${getDbStatus().type}`);
    console.log(`===============================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
