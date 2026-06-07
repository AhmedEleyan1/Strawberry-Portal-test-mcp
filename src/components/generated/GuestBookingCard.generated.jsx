import React from 'react';

// Auto-generated from figma-plugin/screens/GuestBookingCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs GuestBookingCard

export function GuestBookingCard({ bookingNumber, source, checkIn, guestCount, room, checkOut, roomCategory, rate, roomStatus, reservationCreated, products }) {
  return (
    <div className="guest-booking-card">
      <div className="booking-card-heading">
        <h3 className="booking-card-heading-title">Accommodation</h3>
        <a className="btn-primary-action" href="#">
          Open in Mews ↗
        </a>
      </div>
      <div className="booking-card-accent" />
      <div className="booking-meta-row">
        <span className="booking-meta-badge">{bookingNumber}</span>
        <span className="booking-meta-source">{source}</span>
      </div>
      <div className="card">
        <div className="card-grid">
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Check in</span>
              <span className="field-value">{checkIn}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Guest count</span>
              <span className="field-value">{guestCount}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Room</span>
              <span className="field-value">{room}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Check out</span>
              <span className="field-value">{checkOut}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Room category</span>
              <span className="field-value">{roomCategory}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Rate</span>
              <span className="field-value">{rate}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Room status</span>
              <span className="field-value">{roomStatus}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Reservation created on</span>
              <span className="field-value">{reservationCreated}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Products</span>
              <span className="field-value">{products}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
