import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/index.js';
import { getConfig } from '../config/index.js';

const router = Router();

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
}

router.post('/login', async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email) as any;

    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const config = getConfig();
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: `${config.sessionTimeout}s` }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signup', async (req: Request<{}, {}, SignupRequest>, res: Response) => {
  try {
    const config = getConfig();

    if (!config.allowSignup) {
      return res.status(403).json({ error: 'Signup is disabled' });
    }

    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const id = randomUUID();
    const password_hash = await bcrypt.hash(password, 10);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, password_hash, full_name || email, 'user');

    const token = jwt.sign(
      { id, email, role: 'user' },
      config.jwtSecret,
      { expiresIn: `${config.sessionTimeout}s` }
    );

    res.json({
      token,
      user: {
        id,
        email,
        full_name: full_name || email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const config = getConfig();
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    const db = getDatabase();
    const user = db.prepare('SELECT id, email, full_name, role, avatar_url FROM users WHERE id = ? AND is_active = 1').get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
