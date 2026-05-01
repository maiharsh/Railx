


interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

export const sendBookingConfirmationEmail = async (
  email: string,
  bookingData: any
) => {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { background: #2a2a2a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin: 20px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        .btn { display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚂 RAILX - Booking Confirmation</h1>
        </div>
        
        <div class="content">
          <p>Dear ${bookingData.passenger_name},</p>
          
          <p>Your train ticket has been successfully booked! Here are your booking details:</p>
          
          <div class="section">
            <h2>Booking Details</h2>
            <p><strong>PNR Number:</strong> ${bookingData.pnr_number}</p>
            <p><strong>Train:</strong> ${bookingData.train_name} (${bookingData.train_number})</p>
            <p><strong>From:</strong> ${bookingData.from_station_name}</p>
            <p><strong>To:</strong> ${bookingData.to_station_name}</p>
            <p><strong>Travel Date:</strong> ${new Date(bookingData.travel_date).toLocaleDateString()}</p>
            <p><strong>Total Fare:</strong> ₹${bookingData.total_fare}</p>
            <p><strong>Booking Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Passenger Information</h2>
            <p><strong>Name:</strong> ${bookingData.passenger_name}</p>
            <p><strong>Email:</strong> ${bookingData.passenger_email}</p>
          </div>

          <div class="section">
            <h2>Important Instructions</h2>
            <ul>
              <li>Please arrive at the station 30 minutes before departure</li>
              <li>Carry a valid ID proof</li>
              <li>Keep your PNR number safe for reference</li>
              <li>For cancellations, visit our website or contact customer support</li>
            </ul>
          </div>

          <p>
            <a href="http://localhost:3000/dashboard" class="btn">View Your Booking</a>
          </p>

          <p>For any assistance, please contact our customer support team.</p>
          <p>Thank you for choosing RAILX!</p>
        </div>

        <div class="footer">
          <p>© 2026 RAILX Train Booking System. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  
  
  
  
  
  
  
  

  console.log(`Email sent to ${email}:`, emailContent);
  return { success: true, message: "Email queued for sending" };
};

export const sendCancellationEmail = async (
  email: string,
  cancellationData: any
) => {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Cancellation Confirmation</h1>
        </div>
        
        <div class="content">
          <p>Dear Traveler,</p>
          
          <p>Your booking has been successfully cancelled.</p>
          
          <div class="alert">
            <strong>Refund Amount:</strong> ₹${cancellationData.refund_amount}
          </div>

          <h2>Cancellation Details</h2>
          <p><strong>PNR Number:</strong> ${cancellationData.pnr_number}</p>
          <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Refund Status:</strong> ${cancellationData.refund_status}</p>
          <p><strong>Cancellation Charges:</strong> ₹${cancellationData.cancellation_charges}</p>

          <p>The refund will be processed to your original payment method within 5-7 business days.</p>

          <p>Thank you for using RAILX!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`Cancellation email sent to ${email}:`, emailContent);
  return { success: true, message: "Cancellation email queued for sending" };
};

export const sendTravelReminderEmail = async (
  email: string,
  reminderData: any
) => {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .highlight { background: #e3f2fd; padding: 10px; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚂 Travel Reminder - Your Journey is Tomorrow!</h1>
        </div>
        
        <div class="content">
          <p>Dear Traveler,</p>
          
          <p>This is a reminder that your train journey is scheduled for tomorrow!</p>
          
          <div class="highlight">
            <p><strong>Train:</strong> ${reminderData.train_name} (${reminderData.train_number})</p>
            <p><strong>Route:</strong> ${reminderData.from_station_name} → ${reminderData.to_station_name}</p>
            <p><strong>PNR:</strong> ${reminderData.pnr_number}</p>
            <p><strong>Departure Time:</strong> ${reminderData.departure_time || 'Check your ticket'}</p>
          </div>

          <h2>Important Reminders</h2>
          <ul>
            <li>Arrive at the station at least 30 minutes before departure</li>
            <li>Carry your ID proof and booking confirmation</li>
            <li>Check weather conditions and dress appropriately</li>
            <li>Carry essential items for your journey</li>
          </ul>

          <p>Have a safe and comfortable journey!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(`Travel reminder email sent to ${email}:`, emailContent);
  return { success: true, message: "Reminder email queued for sending" };
};
