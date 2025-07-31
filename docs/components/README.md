# Component Documentation

## Admin Components

### AdminDashboard
The main admin dashboard component that displays platform statistics and management interfaces.

**Props:**
- None

**Features:**
- Platform statistics overview
- User management
- Business management
- Withdrawal requests
- Transaction history
- Growth analytics

**Usage:**
```tsx
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  return <AdminDashboard />;
}
```

### PaymentDashboard
Component for managing business payments and analytics.

**Props:**
- None

**Features:**
- Payment processing
- Transaction history
- Revenue analytics
- Payment method management
- Withdrawal functionality

**Usage:**
```tsx
import { PaymentDashboard } from '@/components/user/payment-dashboard';

export default function BusinessPage() {
  return <PaymentDashboard />;
}
```

## User Components

### WithdrawModal
Modal component for handling withdrawal requests.

**Props:**
```typescript
interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  balance: number;
  currency: string;
}
```

**Features:**
- Withdrawal amount input
- Balance display
- Currency selection
- Validation
- Success/error handling

**Usage:**
```tsx
import { WithdrawModal } from '@/components/user/withdraw-modal';

function PaymentPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <WithdrawModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        setIsOpen(false);
        // Refresh data
      }}
      balance={1000}
      currency="USD"
    />
  );
}
```

### AddPaymentMethodModal
Modal for adding new payment methods.

**Props:**
```typescript
interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Features:**
- Payment method form
- Card validation
- Secure input handling
- Success/error handling

**Usage:**
```tsx
import { AddPaymentMethodModal } from '@/components/user/add-payment-method-modal';

function PaymentPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AddPaymentMethodModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => {
        setIsOpen(false);
        // Refresh payment methods
      }}
    />
  );
}
```

## Shared Components

### PaymentMethodIcon
Displays payment method icons based on provider.

**Props:**
```typescript
interface PaymentMethodIconProps {
  brand: string;
  className?: string;
}
```

**Features:**
- Multiple payment provider support
- Responsive sizing
- Custom styling support

**Usage:**
```tsx
import { PaymentMethodIcon } from '@/components/ui/payment-method-icon';

function PaymentMethodCard() {
  return <PaymentMethodIcon brand="visa" className="w-8 h-8" />;
}
```

### StatusBadge
Displays status with appropriate styling.

**Props:**
```typescript
interface StatusBadgeProps {
  status: string;
  className?: string;
}
```

**Features:**
- Multiple status types
- Color-coded styling
- Custom styling support

**Usage:**
```tsx
import { StatusBadge } from '@/components/ui/status-badge';

function TransactionRow() {
  return <StatusBadge status="completed" />;
}
```

## Layout Components

### AdminLayout
Layout wrapper for admin pages.

**Props:**
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- Admin navigation
- Role-based access control
- Responsive design

**Usage:**
```tsx
import { AdminLayout } from '@/components/layouts/admin-layout';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
```

### BusinessLayout
Layout wrapper for business pages.

**Props:**
```typescript
interface BusinessLayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- Business navigation
- Role-based access control
- Responsive design

**Usage:**
```tsx
import { BusinessLayout } from '@/components/layouts/business-layout';

export default function BusinessPage() {
  return (
    <BusinessLayout>
      <PaymentDashboard />
    </BusinessLayout>
  );
}
``` 