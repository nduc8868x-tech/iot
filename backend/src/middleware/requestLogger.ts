import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const ts = new Date().toISOString();
    console.log(`[${ts}] ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
}
