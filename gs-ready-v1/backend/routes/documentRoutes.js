import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import Document, { DOCUMENT_CATEGORIES } from '../models/Document.js';

const router = Router();
const uploadsDir = path.resolve('uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const allowedMime = new Set([
  'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => allowedMime.has(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type')),
});

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const docs = await Document.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(docs.map((d) => ({ ...d.toObject(), fileUrl: d.storedName ? `/uploads/${d.storedName}` : '' })));
  } catch (error) { next(error); }
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const { title, category, institution = '', issueDate = '', originalAvailable = 'false', photocopyAvailable = 'false', notes = '' } = req.body;
    if (!title || !category) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: 'Title and category are required' });
    }
    if (!DOCUMENT_CATEGORIES.includes(category)) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: 'Invalid category' });
    }

    const doc = await Document.create({
      user: req.userId,
      title: title.trim(), category, institution: institution.trim(), issueDate,
      originalAvailable: originalAvailable === 'true', photocopyAvailable: photocopyAvailable === 'true', notes: notes.trim(),
      storedName: req.file?.filename || '', originalName: req.file?.originalname || '', mimeType: req.file?.mimetype || '', size: req.file?.size || 0,
    });
    res.status(201).json({ ...doc.toObject(), fileUrl: doc.storedName ? `/uploads/${doc.storedName}` : '' });
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const allowed = ['title', 'category', 'institution', 'issueDate', 'originalAvailable', 'photocopyAvailable', 'notes'];
    const update = {};
    allowed.forEach((field) => { if (req.body[field] !== undefined) update[field] = req.body[field]; });
    if (update.category && !DOCUMENT_CATEGORIES.includes(update.category)) return res.status(400).json({ message: 'Invalid category' });
    const doc = await Document.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { $set: update }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ ...doc.toObject(), fileUrl: doc.storedName ? `/uploads/${doc.storedName}` : '' });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.storedName) await fs.unlink(path.join(uploadsDir, doc.storedName)).catch(() => {});
    res.json({ message: 'Document deleted' });
  } catch (error) { next(error); }
});

export default router;
