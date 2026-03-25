import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { getConfig, saveConfig, generateJWTSecret, isInstalled } from '../config/index.js';
import { initializeDatabase, getDatabase } from '../database/index.js';

const router = Router();

interface SetupRequest {
  siteName: string;
  adminEmail: string;
  adminPassword: string;
  adminFullName?: string;
  allowSignup?: boolean;
  sessionTimeout?: number;
}

router.get('/status', (req: Request, res: Response) => {
  res.json({ installed: isInstalled() });
});

router.post('/install', async (req: Request<{}, {}, SetupRequest>, res: Response) => {
  try {
    if (isInstalled()) {
      return res.status(400).json({ error: 'Application is already installed' });
    }

    const {
      siteName,
      adminEmail,
      adminPassword,
      adminFullName,
      allowSignup = true,
      sessionTimeout = 86400
    } = req.body;

    if (!siteName || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (adminPassword.length < 8) {
      return res.status(400).json({ error: 'Admin password must be at least 8 characters' });
    }

    const jwtSecret = generateJWTSecret();

    saveConfig({
      installed: false,
      siteName,
      adminEmail,
      jwtSecret,
      allowSignup,
      sessionTimeout
    });

    initializeDatabase();

    const db = getDatabase();
    const adminId = randomUUID();
    const password_hash = await bcrypt.hash(adminPassword, 10);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role, is_active)
      VALUES (?, ?, ?, ?, 'admin', 1)
    `).run(adminId, adminEmail, password_hash, adminFullName || 'Administrator');

    saveConfig({ installed: true });

    res.json({
      success: true,
      message: 'Installation completed successfully'
    });
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed: ' + (error as Error).message });
  }
});

router.get('/config', (req: Request, res: Response) => {
  if (!isInstalled()) {
    return res.status(400).json({ error: 'Application not installed' });
  }

  const config = getConfig();
  res.json({
    siteName: config.siteName,
    allowSignup: config.allowSignup,
    sessionTimeout: config.sessionTimeout
  });
});

export default router;
