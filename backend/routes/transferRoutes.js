const express = require('express');
const Transfer = require('../models/Transfer');
const router = express.Router();
const axios = require('axios');

// GET all transfers
router.get('/', async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new transfer
router.post('/', async (req, res) => {
  const transfer = new Transfer({
    player: req.body.player,
    fromClub: req.body.fromClub,
    toClub: req.body.toClub,
    fee: req.body.fee,
    date: req.body.date,
  });

  try {
    const newTransfer = await transfer.save();
    res.status(201).json(newTransfer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET live transfer data from external API and store in DB
router.get('/live', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/transfers', {
      headers: {
        'X-Auth-Token': process.env.API_KEY
      }
    });

    const transfers = response.data.transfers; // Adjust this based on the API structure

    const savedTransfers = await Promise.all(transfers.map(async (transfer) => {
      const newTransfer = new Transfer({
        player: transfer.playerName,
        fromClub: transfer.fromClub,
        toClub: transfer.toClub,
        fee: transfer.transferFee,
        date: transfer.transferDate
      });
      return newTransfer.save();
    }));

    res.status(200).json({ message: 'Live data fetched and saved!', savedTransfers });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching live data', error: err.message });
  }
});



module.exports = router;
