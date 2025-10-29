import { X, Phone, Mail, Calendar, Users, DollarSign, Edit, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import { DropdownMenu } from './ui/dropdown-menu'
import { bookingsApi } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'

interface BookingDetailsPanelProps {
  booking: any
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailsPanel({ booking, isOpen, onClose }: BookingDetailsPanelProps) {
  const queryClient = useQueryClient()

  const markAsPaidMutation = useMutation({
    mutationFn: () => bookingsApi.markPaid(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      alert('Booking marked as paid!')
    },
    onError: (error: any) => {
      alert(`Failed to mark as paid: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  const cancelBookingMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      alert('Booking cancelled!')
    },
    onError: (error: any) => {
      alert(`Failed to cancel booking: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  if (!isOpen || !booking) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu
                items={[
                  {
                    label: 'Edit Booking',
                    icon: <Edit className="h-4 w-4" />,
                    onClick: () => alert('Edit booking functionality'),
                  },
                  {
                    label: 'Delete Booking',
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => {
                      if (confirm('Are you sure you want to delete this booking?')) {
                        // Delete logic here
                      }
                    },
                    variant: 'danger',
                  },
                ]}
              />
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Customer Info */}
            <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 shadow-md">
                  <span className="text-lg font-bold text-white">
                    {booking.customer?.fullName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                  <p className="font-semibold text-gray-900">{booking.customer?.fullName}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${booking.customer?.phone}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {booking.customer?.phone}
                    </a>
                  </div>
                </div>

                {booking.customer?.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${booking.customer?.email}`} className="font-medium text-gray-900 hover:text-primary transition-colors truncate block">
                        {booking.customer?.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tour Details */}
            <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tour Details</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Tour</p>
                    <p className="font-semibold text-gray-900">{booking.tourDate?.tour?.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(booking.tourDate?.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">People</p>
                    <p className="font-medium text-gray-900">{booking.people} people</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-primary/5 -mx-5 -mb-5 mt-4 p-5 rounded-b-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Total Price</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Status</p>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
                  booking.status === 'NEW'
                    ? 'bg-orange-100 text-orange-800'
                    : booking.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${
                  booking.status === 'NEW'
                    ? 'bg-orange-500'
                    : booking.status === 'PAID'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`} />
                {booking.status}
              </span>
            </div>

            {/* Note */}
            {booking.note && (
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Note</p>
                <p className="text-sm text-gray-700 leading-relaxed">{booking.note}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-6 space-y-3 bg-white">
            {booking.status === 'NEW' && (
              <Button
                onClick={() => markAsPaidMutation.mutate()}
                disabled={markAsPaidMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl"
              >
                {markAsPaidMutation.isPending ? 'Processing...' : 'Mark as Paid'}
              </Button>
            )}
            
            {booking.status !== 'CANCELLED' && (
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking?')) {
                    cancelBookingMutation.mutate()
                  }
                }}
                disabled={cancelBookingMutation.isPending}
                variant="outline"
                className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                {cancelBookingMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
