import React from 'react';
import { AppError, ErrorCategory, ErrorSeverity, logError } from '@/lib/error-handling';

export interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    logError(
      new AppError(
        error.message,
        ErrorCategory.SYSTEM,
        ErrorSeverity.HIGH,
        'REACT_ERROR',
        {
          timestamp: new Date(),
          additionalData: { componentStack: errorInfo.componentStack }
        }
      )
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
} 