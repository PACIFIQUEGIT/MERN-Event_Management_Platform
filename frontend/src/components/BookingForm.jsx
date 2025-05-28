import React, { useState, useEffect } from 'react';

const BookingForm = ({ eventId, onBook, loading = false, ticketsAvailable = 0 }) => {
  const [ticketsBooked, setTicketsBooked] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticketsBooked > ticketsAvailable) {
      setTicketsBooked(ticketsAvailable > 0 ? ticketsAvailable : 1);
    }
  }, [ticketsAvailable, ticketsBooked]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (ticketsBooked < 1) {
      setError('Please select at least 1 ticket.');
      return;
    }
    if (ticketsBooked > ticketsAvailable) {
      setError(`Cannot book more than ${ticketsAvailable} tickets.`);
      return;
    }

    await onBook({ ticketsBooked: ticketsBooked });
  };

  const handleChange = e => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setTicketsBooked('');
    } else {
      setTicketsBooked(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block mb-2 font-medium">
        Number of Tickets:
        <input
          type="number"
          min="1"
          max={ticketsAvailable}
          value={ticketsBooked}
          onChange={handleChange}
          className="block w-full mt-1 border px-2 py-1 rounded"
          disabled={loading || ticketsAvailable === 0}
          required
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading || ticketsAvailable === 0}
        className={`px-4 py-2 rounded mt-2 text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Booking...' : 'Book Tickets'}
      </button>

      {ticketsAvailable === 0 && (
        <p className="mt-2 text-red-600">No tickets available for this event.</p>
      )}
    </form>
  );
};

export default BookingForm;
