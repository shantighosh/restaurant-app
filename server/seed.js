import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Table from './models/Table.js'; // Ensure the .js extension is present

// Load environmental variables (MONGO_URI)
dotenv.config();

// The layout definition of your restaurant tables
const tables = [
  { tableNumber: 1, capacity: 2, location: 'indoor', status: 'available' },
  { tableNumber: 2, capacity: 2, location: 'indoor', status: 'available' },
  { tableNumber: 3, capacity: 4, location: 'indoor', status: 'available' },
  { tableNumber: 4, capacity: 4, location: 'indoor', status: 'available' },
  { tableNumber: 5, capacity: 6, location: 'indoor', status: 'available' },
  { tableNumber: 6, capacity: 6, location: 'indoor', status: 'available' },
  { tableNumber: 7, capacity: 4, location: 'outdoor', status: 'available' },
  { tableNumber: 8, capacity: 4, location: 'outdoor', status: 'available' },
  { tableNumber: 9, capacity: 8, location: 'outdoor', status: 'available' },
  { tableNumber: 10, capacity: 4, location: 'bar', status: 'available' },
  { tableNumber: 11, capacity: 2, location: 'bar', status: 'available' },
  { tableNumber: 12, capacity: 10, location: 'indoor', status: 'available' },
];

// Establish database connection and run seeding transaction
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔄 Connecting to database to seed table assets...');
    
    // 1. Wipe out any pre-existing tables to start with a fresh slate
    await Table.deleteMany({});
    console.log('🧹 Cleaned existing tables from database.');

    // 2. Insert the fresh structural arrangement array defined above
    await Table.insertMany(tables);
    console.log('✅ 12 Restaurant tables seeded successfully into MongoDB!');
    
    // Shut down script safely with a success status code
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error executing database seeding script:', err);
    // Shut down script with an error status code
    process.exit(1);
  });