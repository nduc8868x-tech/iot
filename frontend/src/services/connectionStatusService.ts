import { ConnectionStatus } from '../types';
import { connectionApi } from '../api/connectionApi';

/**
 * Singleton that polls /api/health (Vite proxies this to the backend).
 * Components subscribe to status changes instead of polling themselves.
 */
class ConnectionStatusService {
  private listeners = new Set<(status: ConnectionStatus) => void>();
  private status: ConnectionStatus = {
    isConnected: true,
    lastConnected: new Date().toISOString(),
    error: null,
  };
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startHealthCheck();
  }

  subscribe(callback: (status: ConnectionStatus) => void): () => void {
    this.listeners.add(callback);
    callback(this.status); // emit current status immediately
    return () => this.listeners.delete(callback);
  }

  getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  setConnected(): void {
    this.status = { isConnected: true, lastConnected: new Date().toISOString(), error: null };
    this.notify();
  }

  setDisconnected(error: string): void {
    this.status = { ...this.status, isConnected: false, error };
    this.notify();
  }

  stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  reset(): void {
    this.setConnected();
  }

  private async healthCheck(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      await connectionApi.healthCheck();
      clearTimeout(timeoutId);
      if (!this.status.isConnected) this.setConnected();
    } catch (err) {
      clearTimeout(timeoutId);
      const message = err instanceof Error ? err.message : 'Connection failed';
      this.setDisconnected(message);
    }
  }

  private startHealthCheck(): void {
    setTimeout(() => this.healthCheck(), 2000);
    this.healthCheckInterval = setInterval(() => this.healthCheck(), 30_000);
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try { cb(this.status); } catch { /* ignore listener errors */ }
    });
  }
}

export const connectionStatusService = new ConnectionStatusService();
