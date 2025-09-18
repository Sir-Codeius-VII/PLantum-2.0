import { AdminDashboard } from '@/components/admin/admin-dashboard';

// Force dynamic rendering since we use React Query
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return <AdminDashboard />;
} 