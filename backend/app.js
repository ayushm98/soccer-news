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

// Use routes
app.use('/api/clubs', clubRoutes);
app.use('/api/transfers', transferRoutes);

// Cron job to fetch live transfer data every hour
cron.schedule('0 * * * *', async () => {
  console.log('Fetching live transfer data...');

  try {
    const response = await axios.get('https://api.soccerdataapi.com/transfers/', {
      params: {
        team_id: 4138,
        auth_token: process.env.SOCCER_API_KEY, // Add this to your .env file
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    });

    const transfers = response.data.transfers.transfers_in; // Adjust based on the response structure

    await Promise.all(
      transfers.map(async (transfer) => {
        const newTransfer = new Transfer({
          player: transfer.player_name,
          fromClub: transfer.from_team.name,
          toClub: transfer.to_team ? transfer.to_team.name : 'Unknown',
          fee: transfer.transfer_amount || 0,
          date: new Date(transfer.transfer_date),
        });
        return newTransfer.save();
      })
    );

    console.log('Live transfer data saved successfully!');
  } catch (err) {
    console.error('Error fetching live data', err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
