'use client';

import React from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  ticketPrice: number;
  isActive: boolean;
  createdAt: number;
}

interface EventCardProps {
  event: Event;
  onBuyTicket?: (eventId: number) => void;
  onUseTicket?: (eventId: number) => void;
  hasTicket?: boolean;
  isTicketUsed?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onBuyTicket,
  onUseTicket,
  hasTicket = false,
  isTicketUsed = false,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (lamports: number) => {
    return (lamports / 1e9).toFixed(4) + ' SOL';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          event.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {event.isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">Peserta:</span>
          <span className="ml-2 text-gray-600">
            {event.currentParticipants}/{event.maxParticipants}
          </span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Harga:</span>
          <span className="ml-2 text-gray-600">{formatPrice(event.ticketPrice)}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Dibuat:</span>
          <span className="ml-2 text-gray-600">{formatDate(event.createdAt)}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">ID Event:</span>
          <span className="ml-2 text-gray-600">#{event.id}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!hasTicket && event.isActive && event.currentParticipants < event.maxParticipants && (
          <button
            onClick={() => onBuyTicket?.(event.id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Beli Tiket
          </button>
        )}
        
        {hasTicket && !isTicketUsed && (
          <button
            onClick={() => onUseTicket?.(event.id)}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Gunakan Tiket
          </button>
        )}
        
        {hasTicket && isTicketUsed && (
          <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-center font-medium">
            Tiket Sudah Digunakan
          </div>
        )}
        
        {!event.isActive && (
          <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-center font-medium">
            Event Tidak Aktif
          </div>
        )}
        
        {event.currentParticipants >= event.maxParticipants && (
          <div className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-md text-center font-medium">
            Event Penuh
          </div>
        )}
      </div>
    </div>
  );
};
