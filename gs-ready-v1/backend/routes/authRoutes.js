import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

function createToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    res.status(201).json({ token: createToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ token: createToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('_id name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) { next(error); }
});

export default router;
