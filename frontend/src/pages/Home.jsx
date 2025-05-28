import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${baseUrl}/events`);

        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await res.json();
        setEvents(data);
        setError('');
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [baseUrl]);

  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">No upcoming events.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
