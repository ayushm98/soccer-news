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
const NewsArticle = require('./models/NewsArticle');
const newsRoutes = require('./routes/newsRoutes');

// Middleware
app.use(express.json());
app.use(cors());

/*
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/soccer-wealth-index', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});
*/

// Connect to MongoDB using the URI from environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected...");
}).catch((err) => {
  console.error("Error connecting to MongoDB", err);
});


// Test route
app.get('/', (req, res) => {
  res.send('Backend Server is Running');
});

// Use routes
app.use('/api/clubs', clubRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/news', newsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

/*
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
*/


app.get('/api/fetch-news', async (req, res) => {
  console.log('Manually fetching soccer news...');

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'soccer',
        apiKey: process.env.NEWS_API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    });

    const articles = response.data.articles;

    await Promise.all(
      articles.map(async (article) => {
        const newArticle = new NewsArticle({
          title: article.title,
          source: article.source.name,
          url: article.url,
          publishedAt: new Date(article.publishedAt),
          summary: article.description,
          relatedClub: article.relatedClub || 'General',
        });

        return newArticle.save();
      })
    );

    res.status(200).json({ message: 'Soccer news fetched and saved successfully!' });
  } catch (err) {
    console.error('Error fetching soccer news:', err.message);
    res.status(500).json({ error: 'Failed to fetch soccer news' });
  }
});