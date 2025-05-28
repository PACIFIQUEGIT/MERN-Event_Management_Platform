import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { AuthContext } from '../contexts/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${baseUrl}/events/${id}`, { headers: config.headers });
      if (!res.ok) throw new Error('Failed to fetch event');

      const data = await res.json();
      setEvent(data);
      setMessage(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setMessage('Could not load event details.');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [id, baseUrl, config.headers]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleBooking = async ({ ticketsBooked }) => {
    setMessage(null);
    setBookingLoading(true);
    try {
      const res = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          eventId: id,
          ticketsBooked,
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Booking failed.';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // fallback
        }
        throw new Error(errorMessage);
      }

      setMessage('Booking successful!');
      fetchEvent(); // Refresh event details
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!event) return <div className="p-4 text-red-600">{message || 'Event not found.'}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
      {event.location && <p className="text-gray-700 mb-4">{event.location}</p>}
      {event.description && <p className="mb-4">{event.description}</p>}

      <div className="mb-2">
        <strong>Tickets available:</strong> {event.ticketAvailability}
      </div>

      {message && (
        <div className="my-2 text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {user ? (
        <BookingForm
          eventId={event._id}
          onBook={handleBooking}
          loading={bookingLoading}
          ticketsAvailable={event.ticketAvailability}
        />
      ) : (
        <div className="text-red-500 mt-4">
          Please{' '}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            log in
          </span>{' '}
          to book tickets.
        </div>
      )}
    </div>
  );
}
