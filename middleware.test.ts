import { NextRequest, NextResponse } from 'next/server';
import { middleware } from './middleware';
import { SecurityService } from './lib/security';

// Mock SecurityService
jest.mock('./lib/security', () => ({
  SecurityService: {
    getInstance: jest.fn(() => ({
      getSecurityHeaders: jest.fn().mockReturnValue({
        'Content-Security-Policy': 'test-policy',
        'X-Frame-Options': 'DENY'
      }),
      checkRateLimit: jest.fn().mockResolvedValue(false),
      validateCsrfToken: jest.fn().mockReturnValue(true),
      sanitizeInput: jest.fn(input => input),
      validateSession: jest.fn().mockResolvedValue('123'),
      validateLogin: jest.fn().mockResolvedValue({ valid: true, requiresTwoFactor: false }),
      verifyTwoFactor: jest.fn().mockResolvedValue(true)
    }))
  }
}));

describe('Middleware', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock request
    mockRequest = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
      headers: new Headers({
        'user-agent': 'test-agent'
      })
    });
    mockRequest.cookies.set('session', 'valid-session');
  });

  describe('Security Headers', () => {
    it('should add security headers to response', async () => {
      const response = await middleware(mockRequest);
      expect(response.headers.get('Content-Security-Policy')).toBe('test-policy');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow request when not rate limited', async () => {
      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(429);
    });

    it('should block request when rate limited', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.checkRateLimit as jest.Mock).mockResolvedValueOnce(true);

      const response = await middleware(mockRequest);
      expect(response.status).toBe(429);
      expect(JSON.parse(await response.text())).toMatchObject({
        error: 'Too many requests'
      });
    });
  });

  describe('CSRF Protection', () => {
    it('should skip CSRF check for GET requests', async () => {
      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(403);
    });

    it('should validate CSRF token for non-GET requests', async () => {
      const postRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: new Headers({
          'user-agent': 'test-agent',
          'x-csrf-token': 'valid-token'
        })
      });
      postRequest.cookies.set('csrf-token', 'valid-token');

      const response = await middleware(postRequest);
      expect(response.status).not.toBe(403);
    });

    it('should reject request with invalid CSRF token', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateCsrfToken as jest.Mock).mockReturnValueOnce(false);

      const postRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: new Headers({
          'user-agent': 'test-agent',
          'x-csrf-token': 'invalid-token'
        })
      });
      postRequest.cookies.set('csrf-token', 'valid-token');

      const response = await middleware(postRequest);
      expect(response.status).toBe(403);
      expect(JSON.parse(await response.text())).toMatchObject({
        error: 'Invalid CSRF token'
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize JSON body for POST requests', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.sanitizeInput as jest.Mock).mockImplementation(input => `sanitized-${input}`);

      const postRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: new Headers({
          'user-agent': 'test-agent',
          'content-type': 'application/json'
        }),
        body: JSON.stringify({ test: 'value' })
      });

      await middleware(postRequest);
      expect(securityService.sanitizeInput).toHaveBeenCalled();
    });

    it('should not sanitize non-JSON requests', async () => {
      const securityService = SecurityService.getInstance();

      const postRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: new Headers({
          'user-agent': 'test-agent',
          'content-type': 'text/plain'
        }),
        body: 'test value'
      });

      await middleware(postRequest);
      expect(securityService.sanitizeInput).not.toHaveBeenCalled();
    });
  });

  describe('IP Whitelisting', () => {
    it('should allow access for whitelisted IP', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: true,
        requiresTwoFactor: false
      });

      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(403);
    });

    it('should deny access for non-whitelisted IP', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: false,
        requiresTwoFactor: false,
        reason: 'IP not whitelisted'
      });

      const response = await middleware(mockRequest);
      expect(response.status).toBe(403);
      const body = JSON.parse(await response.text());
      expect(body.error).toBe('Access denied');
      expect(body.message).toBe('IP not whitelisted');
    });
  });

  describe('Two-Factor Authentication', () => {
    it('should require 2FA for sensitive routes', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: true,
        requiresTwoFactor: true
      });

      const sensitiveRequest = new NextRequest('http://localhost:3000/api/payments', {
        method: 'GET',
        headers: new Headers({
          'user-agent': 'test-agent'
        })
      });
      sensitiveRequest.cookies.set('session', 'valid-session');

      const response = await middleware(sensitiveRequest);
      expect(response.status).toBe(403);
      const body = JSON.parse(await response.text());
      expect(body.error).toBe('2FA required');
    });

    it('should validate 2FA token for sensitive routes', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: true,
        requiresTwoFactor: true
      });

      const sensitiveRequest = new NextRequest('http://localhost:3000/api/payments', {
        method: 'GET',
        headers: new Headers({
          'user-agent': 'test-agent',
          'x-2fa-token': 'valid-token'
        })
      });
      sensitiveRequest.cookies.set('session', 'valid-session');

      const response = await middleware(sensitiveRequest);
      expect(response.status).not.toBe(403);
      expect(securityService.verifyTwoFactor).toHaveBeenCalledWith('123', 'valid-token');
    });

    it('should reject invalid 2FA token', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: true,
        requiresTwoFactor: true
      });
      (securityService.verifyTwoFactor as jest.Mock).mockResolvedValueOnce(false);

      const sensitiveRequest = new NextRequest('http://localhost:3000/api/payments', {
        method: 'GET',
        headers: new Headers({
          'user-agent': 'test-agent',
          'x-2fa-token': 'invalid-token'
        })
      });
      sensitiveRequest.cookies.set('session', 'valid-session');

      const response = await middleware(sensitiveRequest);
      expect(response.status).toBe(403);
      const body = JSON.parse(await response.text());
      expect(body.error).toBe('Invalid 2FA token');
    });

    it('should skip 2FA for non-sensitive routes', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateLogin as jest.Mock).mockResolvedValueOnce({
        valid: true,
        requiresTwoFactor: true
      });

      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(403);
      expect(securityService.verifyTwoFactor).not.toHaveBeenCalled();
    });
  });

  describe('Session Validation', () => {
    it('should handle missing session', async () => {
      const requestWithoutSession = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: new Headers({
          'user-agent': 'test-agent'
        })
      });

      const response = await middleware(requestWithoutSession);
      expect(response.status).not.toBe(403);
    });

    it('should handle invalid session', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.validateSession as jest.Mock).mockResolvedValueOnce(false);

      const response = await middleware(mockRequest);
      expect(response.status).not.toBe(403);
    });
  });

  describe('Public Routes', () => {
    it('should skip security checks for 2FA setup routes', async () => {
      const securityService = SecurityService.getInstance();
      const publicRequest = new NextRequest('http://localhost:3000/api/2fa/setup', {
        method: 'POST',
        headers: new Headers({
          'user-agent': 'test-agent'
        })
      });

      await middleware(publicRequest);
      expect(securityService.validateLogin).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle middleware errors gracefully', async () => {
      const securityService = SecurityService.getInstance();
      (securityService.checkRateLimit as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      const response = await middleware(mockRequest);
      expect(response.status).toBe(500);
      const body = JSON.parse(await response.text());
      expect(body).toHaveProperty('error');
      expect(body).toHaveProperty('code');
    });
  });
}); 