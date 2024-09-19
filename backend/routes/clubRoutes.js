const express = require('express');
const Club = require('../models/Club');
const router = express.Router();

// GET all clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new club
router.post('/', async (req, res) => {
  const club = new Club({
    name: req.body.name,
    marketValue: req.body.marketValue,
    netSpend: req.body.netSpend,
    transferSpending: req.body.transferSpending,
    fanPerceptionScore: req.body.fanPerceptionScore
  });

  try {
    const newClub = await club.save();
    res.status(201).json(newClub);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
