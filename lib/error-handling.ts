export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  PAYMENT = 'payment',
  DATABASE = 'database',
  NETWORK = 'network',
  SECURITY = 'security',
  SYSTEM = 'system'
}

export interface ErrorContext {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  timestamp: Date;
  additionalData?: Record<string, any>;
}

export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;
  public readonly recoverySteps?: string[];

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    code: string,
    context: ErrorContext,
    isOperational = true,
    recoverySteps?: string[]
  ) {
    super(message);
    this.name = this.constructor.name;
    this.category = category;
    this.severity = severity;
    this.code = code;
    this.context = context;
    this.isOperational = isOperational;
    this.recoverySteps = recoverySteps;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      code: this.code,
      context: this.context,
      isOperational: this.isOperational,
      recoverySteps: this.recoverySteps,
      stack: this.stack
    };
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.VALIDATION,
      ErrorSeverity.LOW,
      'VALIDATION_ERROR',
      context,
      true,
      recoverySteps
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      'AUTH_ERROR',
      context,
      true,
      recoverySteps
    );
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.AUTHORIZATION,
      ErrorSeverity.HIGH,
      'FORBIDDEN',
      context,
      true,
      recoverySteps
    );
  }
}

export class PaymentError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.PAYMENT,
      ErrorSeverity.HIGH,
      'PAYMENT_ERROR',
      context,
      true,
      recoverySteps
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.DATABASE,
      ErrorSeverity.CRITICAL,
      'DB_ERROR',
      context,
      false,
      recoverySteps
    );
  }
}

export class NetworkError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.NETWORK,
      ErrorSeverity.MEDIUM,
      'NETWORK_ERROR',
      context,
      true,
      recoverySteps
    );
  }
}

export class SecurityError extends AppError {
  constructor(message: string, context: ErrorContext, recoverySteps?: string[]) {
    super(
      message,
      ErrorCategory.SECURITY,
      ErrorSeverity.CRITICAL,
      'SECURITY_ERROR',
      context,
      false,
      recoverySteps
    );
  }
}

// Error handling utilities
export async function logError(error: AppError): Promise<void> {
  console.error('Error:', error.toJSON());
}

export function handleError(error: unknown, context: ErrorContext): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Handle unknown errors
  return new AppError(
    'An unexpected error occurred',
    ErrorCategory.SYSTEM,
    ErrorSeverity.HIGH,
    'UNKNOWN_ERROR',
    context,
    false,
    ['Try again later', 'Contact support if the issue persists']
  );
}

// Recovery strategies
export const RecoveryStrategies = {
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    throw lastError!;
  },

  async withFallback<T>(
    primary: () => Promise<T>,
    fallback: () => Promise<T>
  ): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      return await fallback();
    }
  },

  async withTimeout<T>(
    operation: () => Promise<T>,
    timeout: number = 5000
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeout);
    });

    return Promise.race([operation(), timeoutPromise]);
  }
};

export function handlePaymentError(error: any) {
  console.error('Payment error:', error)
  
  if (error.type === 'StripeCardError') {
    return {
      error: 'Your card was declined.',
      code: 'card_declined'
    }
  }
  
  if (error.type === 'StripeInvalidRequestError') {
    return {
      error: 'Invalid payment information.',
      code: 'invalid_request'
    }
  }
  
  return {
    error: 'An unexpected error occurred.',
    code: 'unknown_error'
  }
}

export function handleApiError(error: any) {
  console.error('API error:', error)
  
  if (error.status === 401) {
    return {
      error: 'Unauthorized. Please log in.',
      code: 'unauthorized'
    }
  }
  
  if (error.status === 403) {
    return {
      error: 'You do not have permission to perform this action.',
      code: 'forbidden'
    }
  }
  
  return {
    error: 'An unexpected error occurred.',
    code: 'unknown_error'
  }
} 