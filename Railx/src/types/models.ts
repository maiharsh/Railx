export interface Passenger {
  passenger_id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'Male' | 'Female' | 'Other';
  password_hash: string;
  created_at: Date;
}

export interface Train {
  train_id: number;
  train_number: string;
  train_name: string;
  total_seats: number;
  train_type: 'Express' | 'Superfast' | 'Passenger' | 'Rajdhani';
}

export interface Station {
  station_id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
}

export interface Schedule {
  schedule_id: number;
  train_id: number;
  travel_date: Date;
  from_station: number;
  to_station: number;
  available_seats: number;
  base_fare: number;
}

export interface Booking {
  booking_id: number;
  passenger_id: number;
  schedule_id: number;
  pnr_number: string;
  booking_date: Date;
  total_fare: number;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
}

export interface Seat {
  seat_id: number;
  booking_id: number;
  seat_number: string;
  seat_class: 'General' | 'Sleeper' | 'AC1' | 'AC2' | 'AC3';
  berth_type: 'Lower' | 'Middle' | 'Upper' | 'Side';
  fare: number;
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: 'Card' | 'UPI' | 'NetBanking' | 'Wallet';
  transaction_id: string;
  payment_status: 'Success' | 'Failed' | 'Pending';
  paid_at: Date;
}

export interface UserSession {
  session_id: number;
  passenger_id: number;
  token: string;
  created_at: Date;
  expires_at: Date;
}