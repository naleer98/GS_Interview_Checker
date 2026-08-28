import mongoose from 'mongoose';

export const DOCUMENT_CATEGORIES = [
  'Identity', 'Education', 'Residence', 'Leadership', 'Sports', 'Language', 'ICT / Computer', 'Other'
];

const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, enum: DOCUMENT_CATEGORIES, required: true },
  institution: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  originalAvailable: { type: Boolean, default: false },
  photocopyAvailable: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  storedName: { type: String, default: '' },
  originalName: { type: String, default: '' },
  mimeType: { type: String, default: '' },
  size: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
