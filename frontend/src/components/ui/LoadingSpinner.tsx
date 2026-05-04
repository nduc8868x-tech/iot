import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  return <Loader className={`${sizeMap[size]} animate-spin text-blue-600`} />;
}
