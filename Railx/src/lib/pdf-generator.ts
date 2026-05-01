export const generateTicketPDF = async (bookingData: any) => {
  const ticketHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Train Ticket - ${bookingData.pnr_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: black; color: white; }
        .ticket { border: 2px solid white; padding: 20px; max-width: 600px; margin: 0 auto; background: #1a1a1a; }
        .header { text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; }
        .section { margin: 20px 0; padding: 15px; border-bottom: 1px solid #333; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; }
        .label { color: #999; font-size: 12px; }
        .value { font-weight: bold; }
        .qr-code { text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <div class="header">🚂 RAILX TRAIN TICKET</div>
        
        <div class="section">
          <div class="row">
            <div><span class="label">PNR Number</span><div class="value">${bookingData.pnr_number}</div></div>
            <div><span class="label">Booking Date</span><div class="value">${new Date(bookingData.booking_date).toLocaleDateString()}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="row">
            <div><span class="label">Train Name</span><div class="value">${bookingData.train_name}</div></div>
            <div><span class="label">Train Number</span><div class="value">${bookingData.train_number}</div></div>
          </div>
          <div class="row">
            <div><span class="label">From</span><div class="value">${bookingData.from_station_name}</div></div>
            <div><span class="label">To</span><div class="value">${bookingData.to_station_name}</div></div>
          </div>
          <div class="row">
            <div><span class="label">Travel Date</span><div class="value">${new Date(bookingData.travel_date).toLocaleDateString()}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="row">
            <div><span class="label">Passenger Name</span><div class="value">${bookingData.passenger_name || 'N/A'}</div></div>
            <div><span class="label">Seat Number</span><div class="value">${bookingData.seat_number || 'N/A'}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="row">
            <div><span class="label">Total Fare</span><div class="value">₹${bookingData.total_fare}</div></div>
            <div><span class="label">Status</span><div class="value">${bookingData.status}</div></div>
          </div>
        </div>

        <div class="qr-code">
          <p style="color: #666;">QR Code - Scan at Station</p>
          <div style="font-size: 80px;">█▀█ ▄▄ █▀█</div>
          <div style="font-size: 80px;">█▄█ ░░ █▄█</div>
          <div style="font-size: 80px;">▀░▀ ▀▀ ▀░▀</div>
        </div>

        <div class="footer">
          <p>This is a digital ticket. Present this at the station.</p>
          <p>For more details, visit www.railx.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const newWindow = window.open();
  newWindow?.document.write(ticketHTML);
  newWindow?.document.close();
  newWindow?.print();
};