import { Router, Request, Response } from 'express';
import { publishMQTT } from '../config/mqtt.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

/**
 * POST /api/mqtt/publish
 * Publish message to MQTT topic
 */
router.post('/publish', async (req: Request, res: Response) => {
  try {
    const { topic, message } = req.body;

    // Validate
    if (!topic || !message) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'topic and message are required',
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    // Publish
    await publishMQTT(topic, message);

    const response: ApiResponse<{ topic: string; message: string }> = {
      success: true,
      data: { topic, message },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish message';
    const response: ApiResponse<null> = {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

export default router;
