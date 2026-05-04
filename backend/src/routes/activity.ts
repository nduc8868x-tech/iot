import { Router, Request, Response } from 'express';
import { getActivity, getActivityStats } from '../services/activityService.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const data = await getActivityStats();
    res.json({ success: true, data, timestamp: new Date().toISOString() } satisfies ApiResponse<typeof data>);
  } catch {
    res.status(500).json({ success: false, error: 'Failed to get stats', timestamp: new Date().toISOString() });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const data  = await getActivity(page, limit);
    res.json({ success: true, data, timestamp: new Date().toISOString() } satisfies ApiResponse<typeof data>);
  } catch {
    res.status(500).json({ success: false, error: 'Failed to get activity', timestamp: new Date().toISOString() });
  }
});

export default router;
