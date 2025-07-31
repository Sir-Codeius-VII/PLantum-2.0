"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Dashboard',
    href: '/admin'
  },
  {
    title: 'Users',
    href: '/admin/users'
  },
  {
    title: 'Businesses',
    href: '/admin/businesses'
  },
  {
    title: 'Withdrawals',
    href: '/admin/withdrawals'
  },
  {
    title: 'Transactions',
    href: '/admin/transactions'
  },
  {
    title: 'Settings',
    href: '/admin/settings'
  }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 