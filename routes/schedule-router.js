// routes/schedule.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule-model');

// Create a new schedule
router.post('/schedules/add', (req, res) => {
  const { day, openingTime, closingTime } = req.body;

  const schedule = new Schedule({
    day,
    openingTime,
    closingTime,
  });

  schedule
    .save()
    .then(() => {
      res.status(201).json({ message: 'Schedule added successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to add schedule' });
    });
});

// Get all schedules
router.get('/schedules', (req, res) => {
  Schedule.find()
    .then((schedules) => {
      res.json(schedules);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to retrieve schedules' });
    });
});

module.exports = router;
