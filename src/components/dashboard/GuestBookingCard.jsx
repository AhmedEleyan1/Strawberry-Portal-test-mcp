import React from 'react';
import { Icon } from '../shared/Icon';
import { StatusBadge } from '../shared/StatusBadge';

export function GuestBookingCard({ booking = {} }) {
  const {
    bookingNumber = 'NO827181777289',
    source = 'App',
    checkIn = '17 Oct 2025',
    checkOut = '18 Oct 2025',
    guestCount = '2 Adults',
    room = '1615',
    roomCategory = 'Standard Twin Bed',
    rate = 'Helpensjon konferanse',
    roomStatus = '–',
    reservationCreated = '25 Jul 2025',
    products = [
      '2 x Hotel Factor included',
      '2 x Breakfast included',
      '2 x 3 Course Dinner included'
    ],
    notes = '',
    mewsUrl = '#',
  } = booking;

  return (
    <div className="booking-card" aria-label="Guest booking accommodation">
      {/* Card Heading — with "Open in Mews" button */}
      <div className="booking-card-heading">
        <div className="booking-card-heading-left">
          <Icon name="accommodation" className="booking-card-heading-icon" />
          <h3 className="booking-card-heading-title">Accommodation</h3>
        </div>
        <a
          href={mewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-action"
          id="go-to-booking-mews"
        >
          Open in Mews
          <Icon name="arrowOut" className="btn-primary-action-icon" />
        </a>
      </div>

      {/* Red accent line under heading */}
      <div className="booking-card-accent" />

      {/* Booking meta row */}
      <div className="booking-meta-row">
        <span className="booking-meta-badge">
          Booking number: {bookingNumber}
        </span>
        <span className="booking-meta-separator">|</span>
        <span className="booking-meta-source">
          <Icon name="bookingSource" className="booking-meta-icon" />
          {source}
        </span>
      </div>

      {/* Details grid */}
      <div className="booking-details-grid">
        {/* Left column */}
        <div className="booking-details-col">
          <div className="booking-detail-item">
            <span className="booking-detail-label">Check in</span>
            <span className="booking-detail-value">{checkIn}</span>
          </div>
          <div className="booking-detail-item">
            <span className="booking-detail-label">Guest count</span>
            <span className="booking-detail-value">{guestCount}</span>
          </div>
          <div className="booking-detail-item">
            <span className="booking-detail-label">Room</span>
            <span className="booking-detail-value">{room}</span>
          </div>
        </div>

        {/* Right column */}
        <div className="booking-details-col">
          <div className="booking-detail-item">
            <span className="booking-detail-label">Check out</span>
            <span className="booking-detail-value">{checkOut}</span>
          </div>
          <div className="booking-detail-item">
            <span className="booking-detail-label">Room category</span>
            <span className="booking-detail-value">{roomCategory}</span>
          </div>
          <div className="booking-detail-item">
            <span className="booking-detail-label">Rate</span>
            <span className="booking-detail-value">{rate}</span>
          </div>
        </div>

        {/* Third column */}
        <div className="booking-details-col">
          <div className="booking-detail-item">
            <span className="booking-detail-label">Room status</span>
            <span className="booking-detail-value">{roomStatus}</span>
          </div>
          <div className="booking-detail-item">
            <span className="booking-detail-label">Reservation created on</span>
            <span className="booking-detail-value">{reservationCreated}</span>
          </div>
        </div>

        {/* Products column */}
        <div className="booking-details-col">
          <div className="booking-detail-item">
            <span className="booking-detail-label">Products</span>
            <div className="booking-detail-value booking-products">
              {products.map((p, i) => (
                <span key={i}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notes section (if present) */}
      {notes && (
        <div className="booking-notes">
          <div className="booking-notes-header">
            <Icon name="pin" className="booking-notes-icon" />
            <span className="booking-notes-title">Notes</span>
          </div>
          <p className="booking-notes-text">{notes}</p>
        </div>
      )}
    </div>
  );
}
