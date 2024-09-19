require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const cron = require('node-cron');
const axios = require('axios');
const Transfer = require('./models/Transfer');
const clubRoutes = require('./routes/clubRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/soccer-wealth-index', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// Use routes
app.use('/api/clubs', clubRoutes);
app.use('/api/transfers', transferRoutes);

// Cron job to fetch live transfer data every hour
cron.schedule('0 * * * *', async () => {
  console.log('Fetching live transfer data...');

  try {
    const response = await axios.get('https://api.football-data.org/v4/transfers', {
      headers: {
        'X-Auth-Token': process.env.API_KEY
      }
    });

    const transfers = response.data.transfers; // Adjust based on API structure

    await Promise.all(transfers.map(async (transfer) => {
      const newTransfer = new Transfer({
        player: transfer.playerName,
        fromClub: transfer.fromClub,
        toClub: transfer.toClub,
        fee: transfer.transferFee,
        date: transfer.transferDate
      });
      return newTransfer.save();
    }));

    console.log('Live transfer data saved successfully!');
  } catch (err) {
    console.error('Error fetching live data', err.message);
  }
});