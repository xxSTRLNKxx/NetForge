import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getDatabase } from '../database/index.js';
import { getConfig, isInstalled } from '../config/index.js';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  if (!isInstalled()) {
    return res.status(503).json({ error: 'Application not installed' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const config = getConfig();
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

router.use(authenticate);

function createCrudRoutes(tableName: string, canWrite: boolean = true) {
  router.get(`/${tableName}`, (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const rows = db.prepare(`SELECT * FROM ${tableName} ORDER BY created_at DESC`).all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  router.get(`/${tableName}/:id`, (req: AuthRequest, res: Response) => {
    try {
      const db = getDatabase();
      const row = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);

      if (!row) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.json(row);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  if (canWrite) {
    router.post(`/${tableName}`, (req: AuthRequest, res: Response) => {
      try {
        if (req.user?.role === 'read_only') {
          return res.status(403).json({ error: 'Read-only access' });
        }

        const db = getDatabase();
        const id = randomUUID();
        const data = { ...req.body, id };

        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        db.prepare(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`).run(...values);

        const created = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
        res.status(201).json(created);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    router.put(`/${tableName}/:id`, (req: AuthRequest, res: Response) => {
      try {
        if (req.user?.role === 'read_only') {
          return res.status(403).json({ error: 'Read-only access' });
        }

        const db = getDatabase();
        const data = req.body;

        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), req.params.id];

        const result = db.prepare(`UPDATE ${tableName} SET ${setClause}, updated_at = datetime('now') WHERE id = ?`).run(...values);

        if (result.changes === 0) {
          return res.status(404).json({ error: 'Not found' });
        }

        const updated = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(req.params.id);
        res.json(updated);
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    router.delete(`/${tableName}/:id`, (req: AuthRequest, res: Response) => {
      try {
        if (req.user?.role === 'read_only') {
          return res.status(403).json({ error: 'Read-only access' });
        }

        const db = getDatabase();
        const result = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(req.params.id);

        if (result.changes === 0) {
          return res.status(404).json({ error: 'Not found' });
        }

        res.status(204).send();
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });
  }
}

const tables = [
  'dcim_regions', 'dcim_sites', 'dcim_racks', 'dcim_manufacturers',
  'dcim_device_types', 'dcim_platforms', 'dcim_device_roles', 'dcim_devices',
  'dcim_interfaces', 'dcim_cables',
  'ipam_vrfs', 'ipam_vlan_groups', 'ipam_vlans', 'ipam_prefixes', 'ipam_ip_addresses',
  'circuits_providers', 'circuits_circuit_types', 'circuits_circuits',
  'tenancy_tenant_groups', 'tenancy_tenants', 'tenancy_contact_roles',
  'tenancy_contact_groups', 'tenancy_contacts',
  'virtualization_cluster_types', 'virtualization_clusters', 'virtualization_virtual_machines',
  'designer_diagrams'
];

tables.forEach(table => createCrudRoutes(table));

router.get('/profile', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const user = db.prepare('SELECT id, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = ?').get(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/profile', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const { full_name, avatar_url } = req.body;
    db.prepare('UPDATE users SET full_name = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?').run(full_name, avatar_url || null, req.user?.id);
    const user = db.prepare('SELECT id, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = ?').get(req.user?.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/users', requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const users = db.prepare('SELECT id, email, full_name, avatar_url, role, is_active, created_at FROM users').all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/users/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const { full_name, role, is_active } = req.body;
    const result = db.prepare('UPDATE users SET full_name = ?, role = ?, is_active = ?, updated_at = datetime(\'now\') WHERE id = ?').run(full_name, role, is_active ? 1 : 0, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = db.prepare('SELECT id, email, full_name, avatar_url, role, is_active, created_at FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/users/:id', requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    if (req.params.id === req.user?.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/activity_log', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    let query = 'SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 100';

    if (req.user?.role !== 'admin') {
      query = 'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 100';
      const logs = db.prepare(query).all(req.user?.id);
      return res.json(logs);
    }

    const logs = db.prepare(query).all();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/stats', (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();

    const stats = {
      sites: db.prepare('SELECT COUNT(*) as count FROM dcim_sites').get() as any,
      devices: db.prepare('SELECT COUNT(*) as count FROM dcim_devices').get() as any,
      racks: db.prepare('SELECT COUNT(*) as count FROM dcim_racks').get() as any,
      prefixes: db.prepare('SELECT COUNT(*) as count FROM ipam_prefixes').get() as any,
      ip_addresses: db.prepare('SELECT COUNT(*) as count FROM ipam_ip_addresses').get() as any,
      circuits: db.prepare('SELECT COUNT(*) as count FROM circuits_circuits').get() as any,
      virtual_machines: db.prepare('SELECT COUNT(*) as count FROM virtualization_virtual_machines').get() as any
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
