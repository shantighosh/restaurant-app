require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./models/Table');

const tables = [
  { tableNumber: 1, capacity: 2, location: 'indoor' },
  { tableNumber: 2, capacity: 2, location: 'indoor' },
  { tableNumber: 3, capacity: 4, location: 'indoor' },
  { tableNumber: 4, capacity: 4, location: 'indoor' },
  { tableNumber: 5, capacity: 6, location: 'indoor' },
  { tableNumber: 6, capacity: 6, location: 'indoor' },
  { tableNumber: 7, capacity: 4, location: 'outdoor' },
  { tableNumber: 8, capacity: 4, location: 'outdoor' },
  { tableNumber: 9, capacity: 8, location: 'outdoor' },
  { tableNumber: 10, capacity: 4, location: 'bar' },
  { tableNumber: 11, capacity: 2, location: 'bar' },
  { tableNumber: 12, capacity: 10, location: 'indoor' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Table.deleteMany({});
  await Table.insertMany(tables);
  console.log('✅ Tables seeded successfully');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });