import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, '..', '..', 'config.json');

export interface AppConfig {
  installed: boolean;
  siteName: string;
  adminEmail?: string;
  jwtSecret: string;
  databasePath: string;
  allowSignup: boolean;
  sessionTimeout: number;
}

const defaultConfig: AppConfig = {
  installed: false,
  siteName: 'NetForge',
  jwtSecret: '',
  databasePath: './data/netforge.db',
  allowSignup: true,
  sessionTimeout: 86400
};

export function getConfig(): AppConfig {
  if (!fs.existsSync(CONFIG_FILE)) {
    return defaultConfig;
  }

  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...defaultConfig, ...JSON.parse(data) };
  } catch (error) {
    return defaultConfig;
  }
}

export function saveConfig(config: Partial<AppConfig>): void {
  const current = getConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
}

export function isInstalled(): boolean {
  return getConfig().installed;
}

export function generateJWTSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let secret = '';
  for (let i = 0; i < 64; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}
