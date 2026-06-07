import React from 'react';
import { MainLayout } from './layout/MainLayout';
import { GuestBookingCard } from './dashboard/GuestBookingCard';
import { Icon } from './shared/Icon';
import { StatusBadge } from './shared/StatusBadge';

export function GuestApp() {
  return (
    <MainLayout selectedHotel="Strömstad Spa & Resort" onHotelChange={() => {}}>
      <div className="guest-page">
        {/* Back nav */}
        <a href="#" className="back-link">
          <Icon name="chevronBack" className="back-chevron" />
          Back to Guests
        </a>

        {/* Guest name + badge */}
        <div className="guest-page-header">
          <div className="guest-page-title-row">
            <h1 className="guest-page-title">Anne Victoria Eline Wang Korsmo</h1>
            <StatusBadge status="Silver" style={{ backgroundColor: '#E8E0D8', color: '#403D3B' }} />
          </div>
        </div>

        {/* Accommodation booking card */}
        <GuestBookingCard
          booking={{
            bookingNumber: 'NO827181777289',
            source: 'App',
            checkIn: '17 Oct 2025',
            checkOut: '18 Oct 2025',
            guestCount: '2 Adults',
            room: '1615',
            roomCategory: 'Standard Twin Bed',
            rate: 'Helpensjon konferanse',
            roomStatus: '–',
            reservationCreated: '25 Jul 2025',
            products: [
              '2 x Hotel Factor included',
              '2 x Breakfast included',
              '2 x 3 Course Dinner included'
            ],
            notes: "Hey there! Just wanted to let you know that I'll be arriving a bit later for the checkin",
            mewsUrl: 'https://app.mews.com/booking/NO827181777289',
          }}
        />
      </div>
    </MainLayout>
  );
}
