import React, { useEffect, useState, useCallback, useMemo } from 'react';
import EventCard from '../components/EventCard';
import AdminEventForm from '../components/AdminEventForm';

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [errorEvents, setErrorEvents] = useState('');
  const [errorBookings, setErrorBookings] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Memoize config so it doesn't change each render
  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  // Memoized apiFetch function
  const apiFetch = useCallback(async (url, options = {}) => {
    const res = await fetch(url, {
      headers: config.headers,
      ...options,
    });
    if (!res.ok) {
      let errorText;
      try {
        const json = await res.json();
        errorText = json.message || JSON.stringify(json);
      } catch {
        errorText = await res.text() || res.statusText;
      }
      throw new Error(errorText);
    }
    if (res.status !== 204) {
      return res.json();
    }
    return null;
  }, [config.headers]);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    setErrorEvents('');
    try {
      const data = await apiFetch(`${baseUrl}/events`);
      setEvents(data);
    } catch (err) {
      console.error(err);
      setErrorEvents(err.message || 'Failed to load events.');
    } finally {
      setLoadingEvents(false);
    }
  }, [apiFetch]);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    setErrorBookings('');
    try {
      const data = await apiFetch(`${baseUrl}/bookings`);
      setBookings(data);
    } catch (err) {
      console.error(err);
      setErrorBookings(err.message || 'Failed to load bookings.');
    } finally {
      setLoadingBookings(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    console.log('AdminDashboard rendered');
    fetchEvents();
    fetchBookings();
  }, [fetchEvents, fetchBookings]);

  const handleCreateOrUpdate = async (eventData) => {
    
    setSubmitLoading(true);
    try {
      console.log("Submitting eventData:", eventData);
      const url = editingEvent
        ? `${baseUrl}/events/${editingEvent._id}`
        : `${baseUrl}/events`;
      const method = editingEvent ? 'PUT' : 'POST';

      await apiFetch(url, {
        method,
        body: JSON.stringify(eventData),
      });

      setShowForm(false);
      setEditingEvent(null);
      await fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save event.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiFetch(`${baseUrl}/events/${eventId}`, {
        method: 'DELETE',
      });
      await fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete event.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6 px-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <button
        onClick={() => {
          setEditingEvent(null);
          setShowForm(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Create New Event
      </button>

      {showForm && (
        <AdminEventForm
          initialData={editingEvent}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          loading={submitLoading}
        />
      )}

      <section>
        <h2 className="text-xl font-semibold mb-2 mt-4">All Events</h2>

        {loadingEvents ? (
          <p>Loading events...</p>
        ) : errorEvents ? (
          <p className="text-red-600">{errorEvents}</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">All Bookings</h2>

        {loadingBookings ? (
          <p>Loading bookings...</p>
        ) : errorBookings ? (
          <p className="text-red-600">{errorBookings}</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Event</th>
                <th className="p-2 border">Tickets</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-center">
                  <td className="p-2 border">{booking.user?.email}</td>
                  <td className="p-2 border">{booking.event?.title}</td>
                  <td className="p-2 border">{booking.ticketsBooked}</td>
                  <td className="p-2 border">{booking.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
