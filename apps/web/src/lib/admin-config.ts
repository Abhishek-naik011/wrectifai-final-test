import { LayoutDashboard, Users, Wrench, FileText, FileSpreadsheet, Settings, UserRound, Shield, Bell, HelpCircle, Activity } from 'lucide-react';

export type AdminNavItem = {
  label: string;
  icon?: any;
  href?: string;
  slug?: string;
  children?: AdminNavItem[];
};

export const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard', slug: 'dashboard' },
  { 
    label: 'Garage Management', 
    icon: Wrench,
    slug: 'garages',
    children: [
      { label: 'All Garages', href: '/admin/garages', slug: 'all-garages' },
      { label: 'Pending Approvals', href: '/admin/garages/pending-approvals', slug: 'pending-approvals' },
      { label: 'Register Garage', href: '/admin/garages/register', slug: 'register-garage' },
      { label: 'Suspended Garages', href: '/admin/garages/suspended', slug: 'suspended-garages' },
    ]
  },
  { 
    label: 'Customer Management', 
    icon: Users,
    slug: 'users',
    children: [
      { label: 'All Customers', href: '/admin/users', slug: 'all-customers' },
      { label: 'Customer Verification', href: '/admin/users/verification', slug: 'customer-verification' },
      { label: 'Suspended Customers', href: '/admin/users/suspended', slug: 'suspended-customers' },
    ]
  },
  { 
    label: 'Service Requests', 
    icon: FileText, 
    slug: 'service-requests',
    children: [
      { label: 'All Requests', href: '/admin/service-requests', slug: 'all-requests' },
      { label: 'Pending Requests', href: '/admin/service-requests/pending', slug: 'pending-requests' },
      { label: 'In Progress', href: '/admin/service-requests/in-progress', slug: 'in-progress' },
      { label: 'Completed Requests', href: '/admin/service-requests/completed', slug: 'completed-requests' },
      { label: 'Cancelled Requests', href: '/admin/service-requests/cancelled', slug: 'cancelled-requests' },
    ]
  },
  { label: 'Bookings', icon: FileSpreadsheet, href: '/admin/bookings', slug: 'bookings' },
  { label: 'Quotes', icon: FileSpreadsheet, href: '/admin/quotes', slug: 'quotes' },
  { label: 'Support Center', icon: HelpCircle, href: '/admin/support', slug: 'support' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications', slug: 'notifications' },
  { label: 'Audit Logs', icon: Activity, href: '/admin/audit', slug: 'audit' },
  { label: 'Profile', icon: UserRound, href: '/admin/profile', slug: 'profile' },
  { label: 'Settings', icon: Settings, href: '/admin/settings', slug: 'settings' },
];
