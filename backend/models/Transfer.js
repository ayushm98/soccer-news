const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
  },
  fromClub: {
    type: String,
    required: true,
  },
  toClub: {
    type: String,
  },
  fee: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Transfer = mongoose.model('Transfer', transferSchema);
module.exports = Transfer;
