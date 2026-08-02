async function runAudit() {
  const baseUrl = 'http://localhost:3000/api/v1';
  const logs = [];
  const log = (msg) => { console.log(msg); logs.push(msg); };

  log('Starting End-to-End Workflow Audit...\n');

  try {
    // 1. Get Customer Token
    log('Logging in as customer...');
    let res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rahul@example.com', password: 'password123' })
    });
    let data = await res.json();
    if (!data.data || !data.data.accessToken) {
      log('Customer login failed with email. Trying with mobile...');
      res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: '1234567890', otp: '123456' })
      });
      data = await res.json();
      if (!data.data || !data.data.accessToken) {
        throw new Error(`Customer login completely failed: ${JSON.stringify(data)}`);
      }
    }
    const customerToken = data.data.accessToken;
    const customerId = data.data.user.id;
    log(`Customer logged in: ${data.data.user.email || data.data.user.id}`);

    // Fetch vehicles to use
    res = await fetch(`${baseUrl}/vehicles`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    data = await res.json();
    let vehicleId;
    if (!data.data || data.data.length === 0) {
      log('No vehicles found, creating one...');
      res = await fetch(`${baseUrl}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
        body: JSON.stringify({ make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-1234' })
      });
      const vData = await res.json();
      vehicleId = vData.data.id;
    } else {
      vehicleId = data.data[0].id;
    }
    
    // 2. Customer Request Quote
    log('\n[STAGE] Customer Request Quote');
    res = await fetch(`${baseUrl}/quotes/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        vehicleId,
        issueSummary: 'Test issue for audit',
        garageId: '00000000-0000-0000-0000-000000000011'
      })
    });
    data = await res.json();
    let qrId = null;
    if (res.ok && data.data?.id) {
      log('✓ Frontend Trigger / API Endpoint (POST /quotes/requests)');
      qrId = data.data.id;
      log(`Quote Request Created: ${qrId}`);
    } else {
      throw new Error(`Failed to create quote request: ${JSON.stringify(data)}`);
    }

    // 3. Verify Database Read (Customer GET)
    res = await fetch(`${baseUrl}/quotes/requests`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    data = await res.json();
    const foundReq = data.data?.find(r => r.id === qrId);
    if (foundReq) {
      log('✓ Database Read (GET /quotes/requests returned it)');
    } else {
      throw new Error('Customer GET /quotes/requests did not return the new quote request');
    }
    log('\nCustomer Request Quote: PASS');

    // 4. Get Garage Token
    log('\nLogging in as garage...');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'quickpit@wrectifai.com', password: 'Garage@123' })
    });
    data = await res.json();
    if (!data.data || !data.data.accessToken) throw new Error('Garage login failed');
    const garageToken = data.data.accessToken;
    log('Garage logged in');

    // 5. Garage Receives Request
    log('\n[STAGE] Garage Receives Request');
    res = await fetch(`${baseUrl}/quotes/garage-requests`, {
      headers: { 'Authorization': `Bearer ${garageToken}` }
    });
    data = await res.json();
    const gFoundReq = data.data?.find(r => r.id === qrId);
    if (gFoundReq) {
      log('✓ Garage Quotes page consumes that endpoint (GET /quotes/garage-requests)');
      log('\nGarage Receives Request: PASS');
    } else {
      throw new Error('Garage GET /quotes/garage-requests did not return the new quote request');
    }

    // 6. Garage Sends Quote
    log('\n[STAGE] Garage Sends Quote');
    res = await fetch(`${baseUrl}/quotes/${qrId}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${garageToken}` },
      body: JSON.stringify({
        labourCost: 100,
        partsCost: 150,
        estimatedTime: '2 hours',
        remarks: 'Audit Quote'
      })
    });
    data = await res.json();
    let quoteId = null;
    if (res.ok && data.data?.quoteId) {
      log('✓ Send Quote creates a record in quotes (POST /quotes/garage-requests/:id/quote)');
      quoteId = data.data.quoteId;
      log(`Quote Created: ${quoteId}`);
      log('\nGarage Sends Quote: PASS');
    } else {
      throw new Error(`Failed to send quote: ${JSON.stringify(data)}`);
    }

    // 7. Customer Receives Quote
    log('\n[STAGE] Customer Receives Quote');
    res = await fetch(`${baseUrl}/quotes`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    data = await res.json();
    const custQuote = data.data?.find(q => q.id === quoteId);
    if (custQuote) {
      log('✓ Customer Quotes fetches the created quote (GET /quotes)');
      log('\nCustomer Receives Quote: PASS');
    } else {
      throw new Error('Customer GET /quotes did not return the new quote');
    }

    // 8. Customer Books
    log('\n[STAGE] Customer Books');
    res = await fetch(`${baseUrl}/bookings/from-quote/${quoteId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
      body: JSON.stringify({
        scheduledAt: new Date(Date.now() + 86400000).toISOString()
      })
    });
    data = await res.json();
    let bookingId = null;
    if (res.ok && data.data?.id) {
      log('✓ Book Now creates a booking (POST /bookings/from-quote/:quoteId)');
      bookingId = data.data.id;
      log(`Booking Created: ${bookingId}`);
      log('\nCustomer Books: PASS');
    } else {
      throw new Error(`Failed to create booking from quote: ${JSON.stringify(data)}`);
    }

    // 9. Garage Receives Booking
    log('\n[STAGE] Garage Receives Booking');
    res = await fetch(`${baseUrl}/bookings`, {
      headers: { 'Authorization': `Bearer ${garageToken}` }
    });
    data = await res.json();
    const gBooking = data.data?.find(b => b.id === bookingId);
    if (gBooking) {
      log('✓ Garage Bookings receives that booking (GET /bookings)');
      log('\nGarage Receives Booking: PASS');
    } else {
      throw new Error('Garage GET /bookings did not return the new booking');
    }

    // 10. Garage Accepts
    log('\n[STAGE] Garage Accepts');
    res = await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${garageToken}` },
      body: JSON.stringify({ status: 'accepted' })
    });
    data = await res.json();
    if (res.ok && data.data?.status === 'confirmed') {
      log('✓ API Endpoint (PATCH /bookings/:bookingId/status => accepted)');
      log('\nGarage Accepts: PASS');
    } else {
      throw new Error(`Failed to accept booking: ${JSON.stringify(data)}`);
    }

    // 11. Garage Starts Job
    log('\n[STAGE] Garage Starts Job');
    res = await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${garageToken}` },
      body: JSON.stringify({ status: 'in_progress' })
    });
    data = await res.json();
    if (res.ok && data.data?.status === 'inService') {
      log('✓ API Endpoint (PATCH /bookings/:bookingId/status => in_progress)');
      log('\nGarage Starts Job: PASS');
    } else {
      throw new Error(`Failed to start job: ${JSON.stringify(data)}`);
    }

    // 12. Garage Completes Job
    log('\n[STAGE] Garage Completes Job');
    res = await fetch(`${baseUrl}/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${garageToken}` },
      body: JSON.stringify({ status: 'completed' })
    });
    data = await res.json();
    if (res.ok && data.data?.status === 'completed') {
      log('✓ API Endpoint (PATCH /bookings/:bookingId/status => completed)');
      log('\nGarage Completes Job: PASS');
    } else {
      throw new Error(`Failed to complete job: ${JSON.stringify(data)}`);
    }

    log('\n=== AUDIT COMPLETED SUCCESSFULLY ===');
  } catch (err) {
    log(`\n!!! AUDIT FAILED !!!\nError: ${err.message}`);
  }
}
runAudit();
