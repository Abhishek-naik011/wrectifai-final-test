import { LayoutDashboard, Inbox, CheckCircle, XCircle, FileText, Users, CheckSquare, UserRound, Settings } from 'lucide-react';
import type { NavItem } from '@/components/home/data';

export const garageNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/garage/dashboard', slug: 'dashboard' },
  { label: 'Incoming Requests', icon: Inbox, href: '/garage/incoming-requests', slug: 'incoming-requests' },
  { label: 'Quotes', icon: FileText, href: '/garage/quotes', slug: 'quotes' },
  { label: 'Profile', icon: UserRound, href: '/garage/profile', slug: 'profile' },
  { label: 'Settings', icon: Settings, href: '/garage/settings', slug: 'settings' },
];
