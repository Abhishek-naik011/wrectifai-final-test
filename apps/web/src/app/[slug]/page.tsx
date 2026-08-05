import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { FeatureComingSoonPage } from '@/pages/feature-coming-soon/feature-coming-soon-page';
import { GaragesPage } from '@/pages/garages/garages-page';
import { AIDiagnosePage } from '@/pages/ai-diagnose/ai-diagnose-page';
import { QuotesPage } from '@/pages/quotes/quotes-page';
import { VehiclesPage } from '@/pages/vehicles/vehicles-page';
import { BookingsPage } from '@/pages/bookings/bookings-page';
import { ProfilePage } from '@/pages/profile/profile-page';
import { SettingsPage } from '@/pages/settings/settings-page';
import { HelpPage } from '@/pages/help/help-page';
import { ServicesPage } from '@/pages/services/services-page';
import { ShopPage } from '@/pages/shop/shop-page';
import { WalletPaymentsPage } from '@/pages/wallet-payments/wallet-payments-page';
import { OffersPage } from '@/pages/offers/offers-page';
import { CarTipsPage } from '@/pages/car-tips/car-tips-page';
import { CartPage } from '@/pages/cart/cart-page';
import { ShopAllPage } from '@/pages/shop-all/shop-all-page';
import { NotificationsPage } from '@/pages/notifications/notifications-page';
import { navItems } from '@/components/home/data';

const featurePageCopy: Record<string, string> = {
  'ai-diagnose': 'The dedicated WrectifAI diagnosis workflow is being prepared. Symptom capture, vehicle context, and guided issue triage will land here soon.',
  services:
    'Service discovery, bundles, and booking flows are being built for this section. You will be able to compare services and continue into booking from here.',
  shop: 'Parts, accessories, and curated marketplace listings will appear here soon.',
  garages:
    'Garage discovery, trust signals, and filterable results are under construction for this page.',
  bookings:
    'Booking tracking, schedules, and upcoming service management will be available here soon.',
  quotes:
    'Quote requests, quote comparison, and selection workflows are coming to this page.',
  vehicles:
    'Vehicle management, profile details, and service history tools will live here soon.',
  offers:
    'All platform offers, promo bundles, and discount campaigns will be collected here soon.',
  'car-tips':
    'Educational car care articles, maintenance guidance, and preventive tips will be published here soon.',
  'wallet-payments':
    'Wallet balance, payment methods, and transaction history will be available here soon.',
};

export function generateStaticParams() {
  return navItems
    .filter((item) => item.href !== '/')
    .map((item) => ({ slug: item.slug }));
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = navItems.find((entry) => entry.slug === slug && entry.href !== '/');

  if (!item) {
    notFound();
  }

  if (slug === 'garages') {
    return (
      <Suspense fallback={null}>
        <GaragesPage />
      </Suspense>
    );
  }

  if (slug === 'ai-diagnose') {
    return (
      <Suspense fallback={null}>
        <AIDiagnosePage />
      </Suspense>
    );
  }

  if (slug === 'quotes') {
    return (
      <Suspense fallback={null}>
        <QuotesPage />
      </Suspense>
    );
  }

  if (slug === 'vehicles') {
    return (
      <Suspense fallback={null}>
        <VehiclesPage />
      </Suspense>
    );
  }

  if (slug === 'bookings') {
    return (
      <Suspense fallback={null}>
        <BookingsPage />
      </Suspense>
    );
  }

  if (slug === 'profile') {
    return (
      <Suspense fallback={null}>
        <ProfilePage />
      </Suspense>
    );
  }

  if (slug === 'settings') {
    return (
      <Suspense fallback={null}>
        <SettingsPage />
      </Suspense>
    );
  }

  if (slug === 'help-support') {
    return (
      <Suspense fallback={null}>
        <HelpPage />
      </Suspense>
    );
  }

  if (slug === 'services') {
    return (
      <Suspense fallback={null}>
        <ServicesPage />
      </Suspense>
    );
  }

  if (slug === 'shop') {
    return (
      <Suspense fallback={null}>
        <ShopPage />
      </Suspense>
    );
  }

  if (slug === 'wallet-payments') {
    return (
      <Suspense fallback={null}>
        <WalletPaymentsPage />
      </Suspense>
    );
  }

  if (slug === 'offers') {
    return (
      <Suspense fallback={null}>
        <OffersPage />
      </Suspense>
    );
  }

  if (slug === 'car-tips') {
    return (
      <Suspense fallback={null}>
        <CarTipsPage />
      </Suspense>
    );
  }

  if (slug === 'cart') {
    return (
      <Suspense fallback={null}>
        <CartPage />
      </Suspense>
    );
  }

  if (slug === 'shop-all') {
    return (
      <Suspense fallback={null}>
        <ShopAllPage />
      </Suspense>
    );
  }

  if (slug === 'notifications') {
    return (
      <Suspense fallback={null}>
        <NotificationsPage />
      </Suspense>
    );
  }

  return (
    <FeatureComingSoonPage
      title={`${item.label} Feature Coming Soon`}
      description={featurePageCopy[slug] ?? 'This feature is currently under development and will be available soon.'}
    />
  );
}
