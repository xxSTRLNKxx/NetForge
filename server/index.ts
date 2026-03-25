import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import authRoutes from './routes/auth.js';
import setupRoutes from './routes/setup.js';
import apiRoutes from './routes/api.js';
import { isInstalled } from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', installed: isInstalled() });
});

app.use('/api/setup', setupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

const distPath = path.join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!isInstalled()) {
    console.log('\n🚀 Welcome to NetForge!');
    console.log('👉 Visit http://localhost:' + PORT + '/setup to complete installation\n');
  }
});
