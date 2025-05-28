import React, { useState, useEffect } from 'react';

const AdminEventForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    totalTickets: 100,
  });

  // Update formData if editing an existing event
  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : '',
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalTickets' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Validate required fields
  if (!formData.title || !formData.date || !formData.totalTickets) {
    alert('Please fill in required fields: Title, Date, and Tickets.');
    return;
  }

  // Convert formData to match backend field names
  const payload = {
    ...formData,
    ticketAvailability: formData.totalTickets, // backend expects this
  };
  delete payload.totalTickets;

  onSubmit(payload);
};


  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50" noValidate>
      <div className="space-y-4">
        <label className="block">
          <span className="font-semibold mb-1 block">Event Title *</span>
          <input
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold mb-1 block">Date *</span>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold mb-1 block">Location *</span>
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          <span className="font-semibold mb-1 block">Description</span>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </label>

        <label className="block">
          <span className="font-semibold mb-1 block">Total Tickets *</span>
          <input
            name="totalTickets"
            type="number"
            min="1"
            value={formData.totalTickets}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-red-600 underline focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Save Event
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminEventForm;
