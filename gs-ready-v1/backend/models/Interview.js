import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  venue: { type: String, default: '' },
  divisionalSecretariat: { type: String, default: '' },
  referenceNumber: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
