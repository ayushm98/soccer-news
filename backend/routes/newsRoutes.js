const express = require('express');
const NewsArticle = require('../models/NewsArticle');
const router = express.Router();

// GET /api/news - Fetch stored news articles
router.get('/', async (req, res) => {
  try {
    const newsArticles = await NewsArticle.find().sort({ publishedAt: -1 }).limit(10); // Fetch the latest 10 articles
    res.json(newsArticles);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching news articles' });
  }
});

module.exports = router;
