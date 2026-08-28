import { Router } from 'express';
import auth from '../middleware/auth.js';
import Interview from '../models/Interview.js';
import Document from '../models/Document.js';
import ChecklistItem from '../models/ChecklistItem.js';
import MarkScore from '../models/MarkScore.js';
import { MARK_LIMITS } from './markRoutes.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const [interview, documents, checklist, marks] = await Promise.all([
      Interview.findOne({ user: req.userId }),
      Document.find({ user: req.userId }),
      ChecklistItem.find({ user: req.userId }),
      MarkScore.findOne({ user: req.userId }),
    ]);

    const required = checklist.filter((i) => i.required);
    const checklistRatio = required.length ? required.filter((i) => i.completed).length / required.length : 0;

    const interviewFields = ['date', 'time', 'venue', 'divisionalSecretariat', 'referenceNumber'];
    const interviewFilled = interview ? interviewFields.filter((f) => Boolean(interview[f]?.trim())).length : 0;
    const interviewRatio = interviewFilled / interviewFields.length;

    const markKeys = Object.keys(MARK_LIMITS);
    const confirmedCount = marks ? markKeys.filter((key) => marks[key]?.confirmed).length : 0;
    const qualificationRatio = confirmedCount / markKeys.length;

    const verifiedDocs = documents.filter((d) => d.originalAvailable && d.photocopyAvailable).length;
    const verificationRatio = documents.length ? verifiedDocs / documents.length : 0;

    const readiness = Math.round(
      checklistRatio * 60 + interviewRatio * 10 + qualificationRatio * 20 + verificationRatio * 10
    );

    const markTotal = marks ? markKeys.reduce((sum, key) => sum + (marks[key]?.score || 0), 0) : 0;
    const markMaximum = Object.values(MARK_LIMITS).reduce((a, b) => a + b, 0);

    res.json({
      readiness,
      breakdown: {
        documents: Math.round(checklistRatio * 100),
        interviewDetails: Math.round(interviewRatio * 100),
        qualifications: Math.round(qualificationRatio * 100),
        verification: Math.round(verificationRatio * 100),
      },
      interview,
      documentsCount: documents.length,
      checklist: {
        completedRequired: required.filter((i) => i.completed).length,
        requiredTotal: required.length,
        missing: required.filter((i) => !i.completed).map((i) => i.title),
      },
      marks: { total: markTotal, maximum: markMaximum, scores: marks },
    });
  } catch (error) { next(error); }
});

export default router;
