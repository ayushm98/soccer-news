const mongoose = require('mongoose');

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  summary: { type: String },
  relatedClub: { type: String }, // You can optionally relate this to a Club schema
});

module.exports = mongoose.model('NewsArticle', NewsArticleSchema);
