import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import markRoutes from './routes/markRoutes.js';
import summaryRoutes from './routes/summaryRoutes.js';

const app = express();
app.disable('etag');
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'GS Ready API' }));
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/summary', summaryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Maximum size is 8 MB.' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function start() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is missing in .env');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`GS Ready API running on http://localhost:${PORT}`));
}

start().catch((error) => {
  console.error('Startup failed:', error.message);
  process.exit(1);
});
