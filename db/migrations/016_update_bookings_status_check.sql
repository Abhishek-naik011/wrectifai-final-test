-- Update bookings status check to include in_progress and other new statuses

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check CHECK (
    status IN (
        'pendingPayment', 
        'pending', 
        'confirmed', 
        'accepted', 
        'in_progress', 
        'inService',
        'completed', 
        'cancelled', 
        'rejected'
    )
);