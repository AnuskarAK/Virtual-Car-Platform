const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Car = require('./models/Car');
const carsData = require('./data/cars.json');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/builds', require('./routes/builds'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Engine is running' });
});

// Seed cars data (always refresh to pick up changes)
const seedCars = async () => {
    try {
        await Car.deleteMany({});
        await Car.insertMany(carsData);
        console.log('Car data seeded successfully');
    } catch (error) {
        console.error('Error seeding cars:', error.message);
    }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Engine running on port ${PORT}`);
    seedCars();
});
