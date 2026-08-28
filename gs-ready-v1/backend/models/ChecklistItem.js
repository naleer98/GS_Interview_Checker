import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  key: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  required: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

checklistItemSchema.index({ user: 1, key: 1 }, { unique: true });
export default mongoose.model('ChecklistItem', checklistItemSchema);
