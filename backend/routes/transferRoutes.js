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

// GET live transfer data from SoccerDataAPI
router.get('/live', async (req, res) => {
  try {
    const response = await axios.get('https://api.soccerdataapi.com/transfers/', {
      params: {
        team_id: 4138, // You can customize the team ID here
        auth_token: process.env.SOCCER_API_KEY, // Make sure to add this to your .env file
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    });

    const transfers = response.data.transfers.transfers_in; // Adjust based on the response structure

   // Process transfers_in
   const transfersIn = response.data.transfers.transfers_in;
   const savedTransfersIn = await Promise.all(
     transfersIn.map(async (transfer) => {
       const transferDate = new Date(transfer.transfer_date);
       const newTransfer = new Transfer({
         player: transfer.player_name,
         fromClub: transfer.from_team.name,
         toClub: 'Liverpool', // Assuming this is for Liverpool
         fee: transfer.transfer_amount || 0,
         date: !isNaN(transferDate.getTime()) ? transferDate : new Date(),
       });
       return newTransfer.save();
     })
   );

   // Process transfers_out
   const transfersOut = response.data.transfers.transfers_out;
   const savedTransfersOut = await Promise.all(
     transfersOut.map(async (transfer) => {
       const transferDate = new Date(transfer.transfer_date);
       const newTransfer = new Transfer({
         player: transfer.player_name,
         fromClub: 'Liverpool', // Assuming the fromClub is Liverpool for outgoing transfers
         toClub: transfer.to_team ? transfer.to_team.name : 'Unknown', // Handle missing to_team info
         fee: transfer.transfer_amount || 0,
         date: !isNaN(transferDate.getTime()) ? transferDate : new Date(),
       });
       return newTransfer.save();
     })
   );

   // Combine both in and out transfers
   const allTransfers = [...savedTransfersIn, ...savedTransfersOut];

   res.status(200).json({ message: 'Live data fetched and saved!', savedTransfers: allTransfers });
 } catch (err) {
   console.error('Error fetching live data:', err.response ? err.response.data : err.message);
   res.status(500).json({ message: 'Error fetching live data', error: err.message });
 }
});

module.exports = router;
