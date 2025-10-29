import { X, Phone, Mail, DollarSign, ShoppingBag, MessageSquare, Edit, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from './ui/button'
import { DropdownMenu } from './ui/dropdown-menu'
import { customersApi } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'

interface CustomerProfileDrawerProps {
  customer: any
  isOpen: boolean
  onClose: () => void
}

export function CustomerProfileDrawer({ customer, isOpen, onClose }: CustomerProfileDrawerProps) {
  // Fetch customer timeline
  const { data: timeline } = useQuery({
    queryKey: ['customer-timeline', customer?.id],
    queryFn: async () => {
      if (!customer?.id) return []
      const response = await customersApi.getTimeline(customer.id)
      return response.data.data
    },
    enabled: !!customer?.id && isOpen,
  })

  if (!isOpen || !customer) return null

  const totalBookings = customer.bookings?.length || 0
  const totalSpent = customer.bookings?.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0) || 0
  const customerSince = customer.createdAt ? new Date(customer.createdAt) : new Date()

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
            <h2 className="text-xl font-semibold text-gray-900">Customer Profile</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu
                items={[
                  {
                    label: 'Edit Customer',
                    icon: <Edit className="h-4 w-4" />,
                    onClick: () => alert('Edit customer functionality'),
                  },
                  {
                    label: 'Delete Customer',
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => {
                      if (confirm('Are you sure you want to delete this customer?')) {
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
            {/* Customer Header */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-600 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {customer.fullName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{customer.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    Customer since {customerSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${customer.phone}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                      {customer.phone}
                    </a>
                  </div>
                  <button className="text-primary hover:text-primary-600">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>

                {customer.email && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Email</p>
                      <a href={`mailto:${customer.email}`} className="font-medium text-gray-900 hover:text-primary transition-colors truncate block">
                        {customer.email}
                      </a>
                    </div>
                    <button className="text-primary hover:text-primary-600">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Spent</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalSpent)}</p>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Activity Timeline</h3>
              
              {timeline && timeline.length > 0 ? (
                <div className="space-y-4">
                  {timeline.slice(0, 5).map((item: any, index: number) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.status === 'PAID' ? 'bg-green-100' :
                          item.status === 'NEW' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          <div className={`h-2 w-2 rounded-full ${
                            item.status === 'PAID' ? 'bg-green-500' :
                            item.status === 'NEW' ? 'bg-orange-500' :
                            'bg-gray-500'
                          }`} />
                        </div>
                        {index < Math.min(timeline.length - 1, 4) && (
                          <div className="w-0.5 flex-1 bg-gray-200 my-1" style={{ minHeight: '20px' }} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {item.status === 'PAID' ? 'Booked' : item.status === 'NEW' ? 'Inquired about' : 'Activity on'} {item.tourDate?.tour?.title}
                        </p>
                        {item.totalPrice && (
                          <p className="text-xs text-gray-600 mt-1">{formatCurrency(item.totalPrice)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No activity yet</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <Button className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
