import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  score: { type: Number, default: 0, min: 0 },
  confirmed: { type: Boolean, default: false },
  note: { type: String, default: '' },
}, { _id: false });

const markScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  leadership: { type: categorySchema, default: () => ({}) },
  sports: { type: categorySchema, default: () => ({}) },
  language: { type: categorySchema, default: () => ({}) },
  ict: { type: categorySchema, default: () => ({}) },
  interview: { type: categorySchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model('MarkScore', markScoreSchema);
