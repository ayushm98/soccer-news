const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  marketValue: {
    type: Number,
    required: true
  },
  netSpend: {
    type: Number,
    required: true
  },
  transferSpending: {
    type: Number,
    required: true
  },
  fanPerceptionScore: {
    type: Number,
    required: true
  },
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
