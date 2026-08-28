import { Router } from 'express';
import auth from '../middleware/auth.js';
import MarkScore from '../models/MarkScore.js';

const router = Router();
router.use(auth);

export const MARK_LIMITS = {
  leadership: 15,
  sports: 5,
  language: 10,
  ict: 10,
  interview: 10,
};

const emptyScores = () => Object.fromEntries(Object.keys(MARK_LIMITS).map((key) => [key, { score: 0, confirmed: false, note: '' }]));

router.get('/', async (req, res, next) => {
  try {
    const marks = await MarkScore.findOne({ user: req.userId });
    res.json({ scores: marks || emptyScores(), limits: MARK_LIMITS });
  } catch (error) { next(error); }
});

router.put('/', async (req, res, next) => {
  try {
    const update = {};
    for (const [key, max] of Object.entries(MARK_LIMITS)) {
      const incoming = req.body[key];
      if (!incoming) continue;
      const score = Math.min(max, Math.max(0, Number(incoming.score) || 0));
      update[key] = { score, confirmed: Boolean(incoming.confirmed), note: String(incoming.note || '').slice(0, 500) };
    }
    const marks = await MarkScore.findOneAndUpdate({ user: req.userId }, { $set: update }, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.json({ scores: marks, limits: MARK_LIMITS });
  } catch (error) { next(error); }
});

export default router;
