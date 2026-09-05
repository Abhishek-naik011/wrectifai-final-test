export type QuoteStatus = 'new' | 'viewed' | 'expired' | 'open' | 'active' | 'selected' | 'accepted' | 'rejected' | string;

export type QuoteItem = {
  id: string;
  quoteId?: string | null;
  quoteRequestId?: string;
  garageId?: string;
  vehicleId?: string;
  requestStatus?: string;
  hasQuote?: boolean;
  status: QuoteStatus;
  garage: string;
  image: string;
  rating: string;
  reviews: number;
  distance: string;
  meta: string;
  metaSecondary: string;
  price: string;
  savings: string;
  time: string;
  tag?: string;
  details?: any;
  requestCreatedAt?: string;
  requestIssueSummary?: string;
  preferredDate?: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    vin?: string;
    mileage?: number;
  } | null;
  isBooked?: boolean;
  bookingDetails?: {
    id: string;
    status: string;
    createdAt: string;
    scheduledAt: string;
  } | null;
  customerName?: string;
};

const RUPEE = '₹';

export const quoteContextDefaultIssueIds = ['wheel-balance', 'wheel-alignment'];
export const aiEstimatedQuoteRange = `${RUPEE}2,800 - ${RUPEE}3,600`;

export function formatCurrencyINR(val: any): string {
  if (val === null || val === undefined || val === '') return '₹0';
  if (typeof val === 'number') {
    return `₹${val.toLocaleString('en-IN')}`;
  }
  const str = String(val).trim();
  if (str === 'Awaiting Quote') return 'Awaiting Quote';
  if (str.startsWith('$') || str.startsWith('USD')) {
    return str.replace(/\$/g, '₹').replace(/USD\s*/g, '₹');
  }
  if (/^\d+$/.test(str)) {
    return `₹${Number(str).toLocaleString('en-IN')}`;
  }
  return str.startsWith('₹') ? str : `₹${str}`;
}

export const quotesList: QuoteItem[] = [];
