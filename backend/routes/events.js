const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/events
// @desc    Get all events (Public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// @route   POST /api/events
// @desc    Create an event (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { title, date, location, ticketAvailability, ticketPrice } = req.body;

  if (!title || !date || ticketAvailability === undefined) {
    return res.status(400).json({ message: 'Title, date, and ticket availability are required' });
  }

  try {
    const event = new Event({
      title: title.trim(),
      date,
      location: location?.trim(),
      ticketAvailability,
      ticketPrice,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// @route   GET /api/events/:id
// @desc    Get a single event by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error.message);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatableFields = ['title', 'date', 'location', 'ticketAvailability', 'ticketPrice'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error.message);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

module.exports = router;
