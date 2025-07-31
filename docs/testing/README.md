# Testing Documentation

## Overview

This project uses Jest and React Testing Library for testing. The testing setup includes:
- Unit tests for utilities and hooks
- Component tests for UI components
- Integration tests for API routes
- End-to-end tests for critical user flows

## Test Structure

```
__tests__/
├── unit/           # Unit tests for utilities and hooks
├── components/     # Component tests
├── integration/    # API route tests
└── e2e/           # End-to-end tests
```

## Running Tests

### Development
```bash
# Run all tests in watch mode
npm test

# Run specific test file
npm test -- path/to/test.ts

# Run tests with coverage
npm test -- --coverage
```

### CI/CD
```bash
# Run all tests in CI environment
npm run test:ci
```

## Writing Tests

### Component Tests

Example component test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { WithdrawModal } from '@/components/user/withdraw-modal';

describe('WithdrawModal', () => {
  it('validates withdrawal amount', () => {
    render(
      <WithdrawModal
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => {}}
        balance={1000}
        currency="USD"
      />
    );

    const input = screen.getByLabelText(/amount/i);
    fireEvent.change(input, { target: { value: '2000' } });
    
    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
  });
});
```

### API Route Tests

Example API route test:
```typescript
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/admin/dashboard/route';

describe('Admin Dashboard API', () => {
  it('returns dashboard data for admin users', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer admin-token'
      }
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('stats');
  });
});
```

### Integration Tests

Example integration test:
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentDashboard } from '@/components/user/payment-dashboard';

describe('Payment Dashboard Integration', () => {
  it('processes payment successfully', async () => {
    render(<PaymentDashboard />);

    await userEvent.click(screen.getByText(/add payment/i));
    await userEvent.type(screen.getByLabelText(/amount/i), '100');
    await userEvent.click(screen.getByText(/process/i));

    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
  });
});
```

## Test Utilities

### Mock Data

```typescript
// __tests__/utils/mock-data.ts
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  role: 'user'
};

export const mockBusiness = {
  id: '1',
  name: 'Test Business',
  balance: 1000
};
```

### Custom Render Function

```typescript
// __tests__/utils/test-utils.tsx
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <SessionProvider session={mockSession}>{children}</SessionProvider>
    ),
    ...options
  });
}

export * from '@testing-library/react';
export { render };
```

## Testing Best Practices

1. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear, descriptive test names
   - Follow the Arrange-Act-Assert pattern

2. **Component Testing**
   - Test user interactions
   - Verify component state changes
   - Test error handling
   - Mock external dependencies

3. **API Testing**
   - Test successful responses
   - Test error handling
   - Verify authentication/authorization
   - Test input validation

4. **Integration Testing**
   - Test complete user flows
   - Verify data persistence
   - Test error recovery
   - Mock external services

## Mocking

### API Calls
```typescript
jest.mock('@/lib/api', () => ({
  fetchPaymentData: jest.fn().mockResolvedValue(mockPaymentData)
}));
```

### Authentication
```typescript
jest.mock('next-auth/react', () => ({
  useSession: jest.fn().mockReturnValue({
    data: mockSession,
    status: 'authenticated'
  })
}));
```

## Coverage Requirements

- Minimum coverage: 80%
- Critical paths: 100%
- Required coverage for:
  - Components
  - API routes
  - Utility functions
  - Authentication logic
  - Payment processing

## Continuous Integration

Tests are automatically run:
- On every pull request
- Before merging to main branch
- During deployment

## Debugging Tests

1. Use `debug()` from React Testing Library:
```typescript
screen.debug();
```

2. Use Jest's `--verbose` flag:
```bash
npm test -- --verbose
```

3. Use Chrome DevTools:
```bash
npm test -- --runInBand --watchAll=false --debug
```

## Common Issues

1. **Async Testing**
   - Use `waitFor` for async operations
   - Handle loading states
   - Mock timers when needed

2. **Component Updates**
   - Use `act()` for state updates
   - Wait for re-renders
   - Handle cleanup

3. **Mocking**
   - Reset mocks between tests
   - Use `jest.clearAllMocks()`
   - Verify mock calls

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 