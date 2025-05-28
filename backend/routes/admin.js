const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event'); // You forgot this import
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('event', 'title date location');
    res.json(bookings);
  } catch (error) {
    console.error('Admin fetch bookings error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
});

// @route   DELETE /api/admin/bookings/:id
// @desc    Cancel any booking (Admin only)
// @access  Private/Admin
router.delete('/bookings/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const event = await Event.findById(booking.event);
    if (event) {
      event.ticketAvailability += booking.ticketsBooked;
      await event.save();
    }

    await booking.deleteOne();
    res.json({ message: 'Booking canceled by admin' });
  } catch (error) {
    console.error('Admin cancel booking error:', error.message);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

module.exports = router;
