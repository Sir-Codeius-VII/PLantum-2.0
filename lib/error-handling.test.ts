import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  PaymentError,
  DatabaseError,
  NetworkError,
  SecurityError,
  ErrorCategory,
  ErrorSeverity,
  handleError,
  logError,
  RecoveryStrategies
} from './error-handling';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
  }))
}));

describe('Error Handling System', () => {
  const mockContext = {
    userId: '123',
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0',
    requestId: 'req-123',
    timestamp: new Date()
  };

  describe('Error Classes', () => {
    it('should create AppError with correct properties', () => {
      const error = new AppError(
        'Test error',
        ErrorCategory.SYSTEM,
        ErrorSeverity.HIGH,
        'TEST_ERROR',
        mockContext,
        true,
        ['Step 1', 'Step 2']
      );

      expect(error.message).toBe('Test error');
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.context).toBe(mockContext);
      expect(error.isOperational).toBe(true);
      expect(error.recoverySteps).toEqual(['Step 1', 'Step 2']);
    });

    it('should create specific error types with correct categories', () => {
      const validationError = new ValidationError('Invalid input', mockContext);
      expect(validationError.category).toBe(ErrorCategory.VALIDATION);

      const authError = new AuthenticationError('Invalid credentials', mockContext);
      expect(authError.category).toBe(ErrorCategory.AUTHENTICATION);

      const authzError = new AuthorizationError('Access denied', mockContext);
      expect(authzError.category).toBe(ErrorCategory.AUTHORIZATION);

      const paymentError = new PaymentError('Payment failed', mockContext);
      expect(paymentError.category).toBe(ErrorCategory.PAYMENT);

      const dbError = new DatabaseError('Database error', mockContext);
      expect(dbError.category).toBe(ErrorCategory.DATABASE);

      const networkError = new NetworkError('Connection failed', mockContext);
      expect(networkError.category).toBe(ErrorCategory.NETWORK);

      const securityError = new SecurityError('Security breach', mockContext);
      expect(securityError.category).toBe(ErrorCategory.SECURITY);
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase unique violation error', () => {
      const error = {
        code: '23505',
        message: 'Duplicate key value violates unique constraint'
      };
      const handledError = handleError(error, mockContext);
      expect(handledError).toBeInstanceOf(ValidationError);
      expect(handledError.message).toContain('already exists');
    });

    it('should handle Supabase foreign key violation error', () => {
      const error = {
        code: '23503',
        message: 'Foreign key violation'
      };
      const handledError = handleError(error, mockContext);
      expect(handledError).toBeInstanceOf(ValidationError);
      expect(handledError.message).toContain('Referenced record');
    });

    it('should handle network errors', () => {
      const error = new TypeError('Failed to fetch');
      const handledError = handleError(error, mockContext);
      expect(handledError).toBeInstanceOf(NetworkError);
      expect(handledError.message).toContain('Network request failed');
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const handledError = handleError(error, mockContext);
      expect(handledError).toBeInstanceOf(AppError);
      expect(handledError.category).toBe(ErrorCategory.SYSTEM);
    });
  });

  describe('Error Logging', () => {
    it('should log error to database', async () => {
      const error = new AppError(
        'Test error',
        ErrorCategory.SYSTEM,
        ErrorSeverity.HIGH,
        'TEST_ERROR',
        mockContext
      );

      await logError(error);
      expect(createClient).toHaveBeenCalled();
    });
  });

  describe('Recovery Strategies', () => {
    describe('retry', () => {
      it('should retry operation until success', async () => {
        let attempts = 0;
        const operation = async () => {
          attempts++;
          if (attempts < 3) throw new Error('Temporary failure');
          return 'success';
        };

        const result = await RecoveryStrategies.retry(operation, 3, 100);
        expect(result).toBe('success');
        expect(attempts).toBe(3);
      });

      it('should throw after max attempts', async () => {
        const operation = async () => {
          throw new Error('Permanent failure');
        };

        await expect(RecoveryStrategies.retry(operation, 3, 100)).rejects.toThrow('Permanent failure');
      });
    });

    describe('withFallback', () => {
      it('should use fallback when primary fails', async () => {
        const primary = async () => {
          throw new Error('Primary failed');
        };
        const fallback = async () => 'fallback success';

        const result = await RecoveryStrategies.withFallback(primary, fallback);
        expect(result).toBe('fallback success');
      });

      it('should use primary when successful', async () => {
        const primary = async () => 'primary success';
        const fallback = async () => 'fallback success';

        const result = await RecoveryStrategies.withFallback(primary, fallback);
        expect(result).toBe('primary success');
      });
    });

    describe('withTimeout', () => {
      it('should complete operation within timeout', async () => {
        const operation = async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return 'success';
        };

        const result = await RecoveryStrategies.withTimeout(operation, 500);
        expect(result).toBe('success');
      });

      it('should throw on timeout', async () => {
        const operation = async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return 'success';
        };

        await expect(RecoveryStrategies.withTimeout(operation, 100)).rejects.toThrow('Operation timed out');
      });
    });
  });
}); 