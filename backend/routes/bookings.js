const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/bookings
// @desc    Book tickets for an event
// @access  Private
router.post('/', protect, async (req, res) => {
  const { eventId, ticketsBooked } = req.body;

  // Basic validation
  if (!eventId || !ticketsBooked || ticketsBooked <= 0) {
    return res.status(400).json({ message: 'Valid event ID and number of tickets are required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.ticketAvailability < ticketsBooked) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Deduct tickets and save event
    event.ticketAvailability -= ticketsBooked;
    await event.save();

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      ticketsBooked,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error.message);
    res.status(500).json({ message: 'Failed to book tickets' });
  }
});

// @route   GET /api/bookings
// @desc    Get bookings for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('event').populate('user', 'email');
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error.message);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Restore ticket availability
    const event = await Event.findById(booking.event);
    if (event) {
      event.ticketAvailability += booking.ticketsBooked;
      await event.save();
    }

    await booking.deleteOne();

    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

module.exports = router;
