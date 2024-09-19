const mongoose = require('mongoose');
const axios = require('axios');



const transferSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true
  },
  fromClub: {
    type: String,
    required: true
  },
  toClub: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  marketValue: {
    type: Number,
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['rumor', 'confirmed'],
    default: 'rumor'
  }
});

const Transfer = mongoose.model('Transfer', transferSchema);
module.exports = Transfer;
