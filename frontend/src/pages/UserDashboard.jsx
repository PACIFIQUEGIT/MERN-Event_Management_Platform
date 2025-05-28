import React, { useEffect, useState, useCallback, useMemo } from 'react';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/bookings`, {
        method: 'GET',
        headers: config.headers,
      });

      if (!res.ok) throw new Error('Failed to fetch bookings');

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setMessage('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, [config, baseUrl]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelingId(id);
    setMessage('');
    try {
      const res = await fetch(`${baseUrl}/bookings/${id}`, {
        method: 'DELETE',
        headers: config.headers,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to cancel booking');
      }

      setMessage('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      console.error('Cancel failed:', err);
      setMessage(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>

      {message && (
        <div className="mb-4 text-blue-700 bg-blue-100 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border rounded shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{booking.event.title}</h2>
              <p className="text-sm text-gray-600">
                Date: {new Date(booking.event.date).toLocaleDateString()} | Location: {booking.event.location}
              </p>
              <p className="mt-1">Tickets booked: {booking.numberOfTickets}</p>
              <button
                onClick={() => handleCancel(booking._id)}
                disabled={cancelingId === booking._id}
                className={`mt-3 px-3 py-1 rounded text-white ${
                  cancelingId === booking._id
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {cancelingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
