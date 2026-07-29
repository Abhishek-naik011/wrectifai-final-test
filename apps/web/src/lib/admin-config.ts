import { LayoutDashboard, Users, Wrench, FileText, FileSpreadsheet, Settings, UserRound, Shield } from 'lucide-react';
import type { NavItem } from '@/components/home/data';

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', slug: 'dashboard' },
  { label: 'Users', icon: Users, href: '/admin/users', slug: 'users' },
  { label: 'Garages', icon: Wrench, href: '/admin/garages', slug: 'garages' },
  { label: 'Service Requests', icon: FileText, href: '/admin/service-requests', slug: 'service-requests' },
  { label: 'Quotes', icon: FileSpreadsheet, href: '/admin/quotes', slug: 'quotes' },
  { label: 'Reports', icon: Shield, href: '/admin/reports', slug: 'reports' },
  { label: 'Profile', icon: UserRound, href: '/admin/profile', slug: 'profile' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', slug: 'settings' },
];
