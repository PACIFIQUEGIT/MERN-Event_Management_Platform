const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: String,
  ticketAvailability: { type: Number, required: true, min: 0 },
  ticketPrice: { type: Number, min: 0 },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
