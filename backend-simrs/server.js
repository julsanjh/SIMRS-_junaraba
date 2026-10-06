const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');
const initDatabase = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'SIMRS Junaraba Backend API',
        timestamp: new Date().toISOString()
    });
});

// Main API Routes
app.use('/api', apiRoutes);

// Jalankan Server & Inisialisasi Database
app.listen(PORT, async () => {
    console.log(`🚀 Server Backend SIMRS Junaraba berjalan di port ${PORT}`);
    await initDatabase();
});