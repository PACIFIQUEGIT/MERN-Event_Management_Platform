import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const EventCard = ({ event, showActions = false, onEdit, onDelete }) => {
  const {
    _id,
    title,
    date,
    location,
    description,
    bookedTickets,
    totalTickets,
  } = event;

  return (
    <article className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-gray-600 mb-1">{new Date(date).toLocaleDateString()}</p>
      <p className="mb-1">{location}</p>
      <p className="text-sm text-gray-600 mb-2 line-clamp-3">{description}</p>
      <p className="mt-2 font-semibold">
        Tickets: {bookedTickets} / {totalTickets}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/events/${_id}`}
          className="text-blue-600 hover:underline"
          aria-label={`View details for ${title}`}
        >
          View Details
        </Link>

        {showActions && (
          <div className="space-x-3">
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="text-yellow-600 hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(_id)}
              className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string,
    bookedTickets: PropTypes.number,
    totalTickets: PropTypes.number,
  }).isRequired,
  showActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

EventCard.defaultProps = {
  showActions: false,
  onEdit: () => {},
  onDelete: () => {},
};

export default EventCard;
