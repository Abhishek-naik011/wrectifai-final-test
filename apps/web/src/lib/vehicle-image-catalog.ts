export function getVehicleImage(make?: string, model?: string, year?: string | number): string {
  if (!make && !model) return '/assets/mega car.png';

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
  
  const queryParams = new URLSearchParams();
  if (make) queryParams.set('make', make);
  if (model) queryParams.set('model', model);
  if (year) queryParams.set('year', year.toString());

  return `${baseUrl}/vehicles/image?${queryParams.toString()}`;
}

