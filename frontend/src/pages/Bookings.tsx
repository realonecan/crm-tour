import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/layout/Header'
import { BookingDetailsPanel } from '../components/BookingDetailsPanel'
import { bookingsApi } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'

export function Bookings() {
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  const { data: bookings } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: async () => {
      const params: any = {}
      if (statusFilter !== 'All Status') params.status = statusFilter
      
      const response = await bookingsApi.getAll(params)
      return response.data.data
    },
  })

  const groupedBookings = {
    NEW: bookings?.filter((b: any) => b.status === 'NEW') || [],
    PAID: bookings?.filter((b: any) => b.status === 'PAID') || [],
    CANCELLED: bookings?.filter((b: any) => b.status === 'CANCELLED') || [],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'border-orange-300'
      case 'PAID':
        return 'border-green-300'
      case 'CANCELLED':
        return 'border-red-300'
      default:
        return 'border-gray-300'
    }
  }


  return (
    <div>
      <Header title="Bookings" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Manage all customer bookings</p>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option>All Status</option>
            <option>NEW</option>
            <option>PAID</option>
            <option>CANCELLED</option>
          </select>
        </div>

        {/* Status Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Object.entries(groupedBookings).map(([status, items]) => (
            <div key={status} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  status === 'NEW' ? 'bg-orange-500' :
                  status === 'PAID' ? 'bg-green-500' :
                  'bg-red-500'
                }`} />
                <span className="font-medium">{status}</span>
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                  {items.length}
                </span>
              </div>

              {/* Booking Cards */}
              <div className="space-y-3">
                {items.map((booking: any) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`cursor-pointer rounded-lg border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${getStatusColor(booking.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{booking.customer?.fullName}</h3>
                        <p className="text-sm text-gray-600">{booking.tourDate?.tour?.title}</p>
                      </div>
                      <span className="text-xs text-gray-500">{booking.people}p</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">{formatDate(booking.tourDate?.date)}</span>
                      <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    No {status.toLowerCase()} bookings
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Sidebar */}
      <BookingDetailsPanel
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  )
}
