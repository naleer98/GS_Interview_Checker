import { Router } from 'express';
import auth from '../middleware/auth.js';
import Interview from '../models/Interview.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ user: req.userId });
    res.json(interview || { date: '', time: '', venue: '', divisionalSecretariat: '', referenceNumber: '', notes: '' });
  } catch (error) { next(error); }
});

router.put('/', async (req, res, next) => {
  try {
    const fields = ['date', 'time', 'venue', 'divisionalSecretariat', 'referenceNumber', 'notes'];
    const update = {};
    fields.forEach((field) => { if (typeof req.body[field] === 'string') update[field] = req.body[field].trim(); });
    const interview = await Interview.findOneAndUpdate(
      { user: req.userId }, { $set: update }, { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(interview);
  } catch (error) { next(error); }
});

export default router;
