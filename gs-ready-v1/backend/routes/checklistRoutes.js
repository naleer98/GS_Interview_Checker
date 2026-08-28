import { Router } from 'express';
import auth from '../middleware/auth.js';
import ChecklistItem from '../models/ChecklistItem.js';

const router = Router();
router.use(auth);

const DEFAULT_ITEMS = [
  ['interview-letter', 'Interview Letter', 'Identity', true],
  ['nic-passport', 'NIC / Valid Identity Document', 'Identity', true],
  ['birth-certificate', 'Birth Certificate', 'Personal', true],
  ['ol-original', 'G.C.E. O/L Original Certificate', 'Education', true],
  ['al-original', 'G.C.E. A/L Original Certificate', 'Education', true],
  ['education-copies', 'Educational Certificate Copies', 'Education', true],
  ['residence-proof', 'Residence / Electoral Register Evidence', 'Residence', true],
  ['qualification-originals', 'Other Qualification Originals', 'Qualifications', true],
  ['qualification-copies', 'Other Qualification Copies', 'Qualifications', true],
  ['name-proof', 'Name Difference Supporting Proof (if applicable)', 'Other', false],
];

async function ensureDefaults(userId) {
  const count = await ChecklistItem.countDocuments({ user: userId });
  if (count === 0) {
    await ChecklistItem.insertMany(DEFAULT_ITEMS.map(([key, title, category, required]) => ({ user: userId, key, title, category, required })));
  }
}

router.get('/', async (req, res, next) => {
  try {
    await ensureDefaults(req.userId);
    res.json(await ChecklistItem.find({ user: req.userId }).sort({ category: 1, createdAt: 1 }));
  } catch (error) { next(error); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const update = {};
    if (typeof req.body.completed === 'boolean') update.completed = req.body.completed;
    if (typeof req.body.required === 'boolean') update.required = req.body.required;
    const item = await ChecklistItem.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { $set: update }, { new: true });
    if (!item) return res.status(404).json({ message: 'Checklist item not found' });
    res.json(item);
  } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, category = 'Other', required = false } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
    const key = `custom-${Date.now()}`;
    const item = await ChecklistItem.create({ user: req.userId, key, title: title.trim(), category, required: Boolean(required) });
    res.status(201).json(item);
  } catch (error) { next(error); }
});

export default router;
