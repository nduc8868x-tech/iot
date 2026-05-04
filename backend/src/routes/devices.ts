import { Router, Request, Response } from 'express';
import { DeviceService } from '../services/deviceService.js';
import { recordActivity } from '../services/activityService.js';
import { ApiResponse, DeviceControlRequest } from '../types/index.js';

const router = Router();

/**
 * GET /api/devices
 * Get all devices
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const devices = DeviceService.getAllDevices();
    const response: ApiResponse<typeof devices> = {
      success: true,
      data: devices,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to get devices',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

/**
 * GET /api/devices/:deviceId/status
 * Get single device status
 */
router.get('/:deviceId/status', (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = DeviceService.getDeviceById(deviceId);

    if (!device) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Device not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const deviceStatus = {
      id: device.id,
      status: device.status,
      timestamp: device.lastUpdated,
    };

    const response: ApiResponse<typeof deviceStatus> = {
      success: true,
      data: deviceStatus,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to get device status',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

/**
 * POST /api/devices/:deviceId/control
 * Control device (turn ON/OFF)
 */
router.post('/:deviceId/control', async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const { action } = req.body as DeviceControlRequest;

    // Validate action
    if (!['ON', 'OFF'].includes(action)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid action. Must be ON or OFF',
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    // Control device
    const result = await DeviceService.controlDevice(deviceId, action);

    // Append to activity log so ActivityLog page shows live data
    await recordActivity(deviceId, action, result.success);

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to control device';
    const statusCode = message === 'Device not found' ? 404 : 500;

    const response: ApiResponse<null> = {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    };
    res.status(statusCode).json(response);
  }
});

export default router;
