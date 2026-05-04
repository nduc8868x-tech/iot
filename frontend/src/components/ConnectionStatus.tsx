import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnection';
export { LoadingSpinner } from './ui/LoadingSpinner';

/**
 * Component to display connection status in header
 */
export function ConnectionIndicator() {
  const { isConnected, error } = useConnectionStatus();

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-600">Connected</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-red-600">Disconnected</span>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Network status banner component
 * Shows when connection is lost
 */
export function NetworkStatusBanner() {
  const { isConnected, error } = useConnectionStatus();

  if (isConnected) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-50 border-b border-red-200 px-4 py-3 z-50">
      <div className="max-w-[1800px] mx-auto flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-900">
            {error || 'Connection lost'}
          </p>
          <p className="text-xs text-red-700">
            Some features may not work. Attempting to reconnect...
          </p>
        </div>
      </div>
    </div>
  );
}
