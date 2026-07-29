import { LayoutDashboard, Users, Store, Activity, FileText, BarChart, Settings } from 'lucide-react';
import type { NavItem } from '@/components/home/data';

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', slug: 'dashboard' },
  { label: 'Users', icon: Users, href: '/admin/users', slug: 'users' },
  { label: 'Garages', icon: Store, href: '/admin/garages', slug: 'garages' },
  { label: 'Diagnostics', icon: Activity, href: '/admin/diagnostics', slug: 'diagnostics' },
  { label: 'Quotes', icon: FileText, href: '/admin/quotes', slug: 'quotes' },
  { label: 'Analytics', icon: BarChart, href: '/admin/analytics', slug: 'analytics' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', slug: 'settings' },
];
