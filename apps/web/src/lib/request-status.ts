export type RawStatus = 'REQUESTED' | 'QUOTE_SENT' | 'BOOKED' | 'ACCEPTED' | 'INSPECTION' | 'REPAIR' | 'READY_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | string;
export type MappedStatus = 'Pending' | 'Quoted' | 'In Progress' | 'Completed' | 'Cancelled' | 'Unknown';

export function getMappedServiceStatus(rawStatus: RawStatus | null | undefined): MappedStatus {
  if (!rawStatus) return 'Unknown';
  
  const status = rawStatus.toUpperCase();
  
  switch (status) {
    case 'REQUESTED':
      return 'Pending';
      
    case 'QUOTE_SENT':
      return 'Quoted';
      
    case 'BOOKED':
    case 'ACCEPTED':
    case 'INSPECTION':
    case 'REPAIR':
    case 'READY_FOR_DELIVERY':
      return 'In Progress';
      
    case 'COMPLETED':
      return 'Completed';
      
    case 'CANCELLED':
    case 'REJECTED':
      return 'Cancelled';
      
    default:
      return 'Unknown';
  }
}

export function getStatusColorClass(mappedStatus: MappedStatus): string {
  switch (mappedStatus) {
    case 'Pending':
      return 'bg-amber-100 text-amber-700';
    case 'Quoted':
      return 'bg-purple-100 text-purple-700';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}
