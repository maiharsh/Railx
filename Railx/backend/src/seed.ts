import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Station from './models/Station';
import Train from './models/Train';
import Schedule from './models/Schedule';
import Admin from './models/Admin';

dotenv.config();

const MONGODB_URI = process.env.DB_HOST || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'railway_booking';

const mongoUri = `${MONGODB_URI}/${DB_NAME}`;

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    
    await Station.deleteMany({});
    await Train.deleteMany({});
    await Schedule.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    
    const stationsData = [
      {
        station_code: 'DEL',
        station_name: 'New Delhi Railway Station',
        city: 'New Delhi',
        state: 'Delhi'
      },
      {
        station_code: 'MUM',
        station_name: 'Mumbai Central',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      {
        station_code: 'BNG',
        station_name: 'Bengaluru City Railway Station',
        city: 'Bengaluru',
        state: 'Karnataka'
      },
      {
        station_code: 'CHE',
        station_name: 'Chennai Central',
        city: 'Chennai',
        state: 'Tamil Nadu'
      },
      {
        station_code: 'KOL',
        station_name: 'Kolkata Railway Station',
        city: 'Kolkata',
        state: 'West Bengal'
      },
      {
        station_code: 'HYD',
        station_name: 'Hyderabad Deccan',
        city: 'Hyderabad',
        state: 'Telangana'
      },
      {
        station_code: 'PUN',
        station_name: 'Pune Railway Station',
        city: 'Pune',
        state: 'Maharashtra'
      },
      {
        station_code: 'AHM',
        station_name: 'Ahmedabad Junction',
        city: 'Ahmedabad',
        state: 'Gujarat'
      },
      {
        station_code: 'JAI',
        station_name: 'Jaipur Railway Station',
        city: 'Jaipur',
        state: 'Rajasthan'
      },
      {
        station_code: 'LKO',
        station_name: 'Lucknow Railway Station',
        city: 'Lucknow',
        state: 'Uttar Pradesh'
      }
    ];

    const stations = await Station.insertMany(stationsData);
    console.log(`Created ${stations.length} stations`);

    
    const trainsData = [
      {
        train_number: '12001',
        train_name: 'Shatabdi Express',
        total_seats: 500,
        train_type: 'Express'
      },
      {
        train_number: '12002',
        train_name: 'Rajdhani Express',
        total_seats: 450,
        train_type: 'Rajdhani'
      },
      {
        train_number: '12003',
        train_name: 'Flying Ranee',
        total_seats: 520,
        train_type: 'Superfast'
      },
      {
        train_number: '12004',
        train_name: 'Bhopal Express',
        total_seats: 600,
        train_type: 'Express'
      },
      {
        train_number: '12005',
        train_name: 'Mumbai Mail',
        total_seats: 550,
        train_type: 'Passenger'
      },
      {
        train_number: '12006',
        train_name: 'Gujarat Express',
        total_seats: 480,
        train_type: 'Express'
      },
      {
        train_number: '12007',
        train_name: 'Tamil Nadu Express',
        total_seats: 510,
        train_type: 'Superfast'
      },
      {
        train_number: '12008',
        train_name: 'Karnataka Express',
        total_seats: 490,
        train_type: 'Express'
      }
    ];

    const trains = await Train.insertMany(trainsData);
    console.log(`Created ${trains.length} trains`);

    
    const schedulesData : any = [];
    const baseFares = [800, 1200, 1500, 2000, 2500, 3000];
    
    
    const routes = [
      { from: 0, to: 1, days: [1, 2, 3, 4, 5] }, 
      { from: 0, to: 2, days: [1, 3, 5] }, 
      { from: 1, to: 2, days: [0, 1, 2, 3, 4, 5, 6] }, 
      { from: 1, to: 3, days: [2, 4, 6] }, 
      { from: 0, to: 5, days: [1, 4] }, 
      { from: 2, to: 3, days: [1, 3, 5] }, 
      { from: 0, to: 8, days: [0, 2, 4, 6] }, 
      { from: 1, to: 7, days: [1, 3, 5] }, 
    ];

    routes.forEach(route => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      route.days.forEach(day => {
        const scheduleDate = new Date(tomorrow);
        const daysToAdd = (day - scheduleDate.getDay() + 7) % 7;
        scheduleDate.setDate(scheduleDate.getDate() + daysToAdd);

        for (let i = 0; i < 3; i++) {
          const fare = baseFares[Math.floor(Math.random() * baseFares.length)];
          schedulesData.push({
            train_id: trains[Math.floor(Math.random() * trains.length)]._id,
            travel_date: scheduleDate,
            from_station: stations[route.from]._id,
            to_station: stations[route.to]._id,
            available_seats: Math.floor(Math.random() * 100) + 50,
            base_fare: fare
          });
          scheduleDate.setDate(scheduleDate.getDate() + 7);
        }
      });
    });

    const schedules = await Schedule.insertMany(schedulesData);
    console.log(`Created ${schedules.length} schedules`);

    const adminData = [
      {
        username: "super_admin",
        email: "mrpan@gmail.com",
        password_hash: "$2a$10$NXnLmnYBfRvb.oWPPpWxMOTvq6WPw3u4Bf52fYUslrVBGU0JzxqzO",
        role: "super_admin",
        is_active: true,
        last_login: new Date("2026-04-19T15:00:48.412Z"),
        created_at: new Date("2026-04-16T00:00:00.000Z")
      }
    ];

    const admins = await Admin.insertMany(adminData);
    console.log(`Created ${admins.length} admin(s)`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();