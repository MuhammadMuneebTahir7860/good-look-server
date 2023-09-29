// models/schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: String,
  openingTime: String,
  closingTime: String,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
