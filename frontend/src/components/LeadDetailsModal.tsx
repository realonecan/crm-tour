import { X, Trash2, Check } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { leadsApi } from '../lib/api'

interface LeadDetailsModalProps {
  lead: any
  isOpen: boolean
  onClose: () => void
}

export function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => leadsApi.delete(lead.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      onClose()
      alert('Lead deleted successfully!')
    },
    onError: (error: any) => {
      alert(`Failed to delete lead: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  const convertMutation = useMutation({
    mutationFn: (data: any) => leadsApi.convertToBooking(lead.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      onClose()
      alert('Lead converted to booking successfully!')
    },
    onError: (error: any) => {
      alert(`Failed to convert lead: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  const handleConvert = () => {
    // For now, we'll use default values. In production, you'd show another modal to collect this data
    const tourDateId = lead.tour?.dates?.[0]?.id || 1
    const people = 2
    
    if (confirm(`Convert this lead to a booking for ${lead.name}?`)) {
      convertMutation.mutate({ tourDateId, people })
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate()
    }
  }

  if (!isOpen || !lead) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 fade-in-0 duration-200">
        <div className="rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">Lead Details</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Name and Phone Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-2 block">Name</Label>
                <Input
                  id="name"
                  value={lead.name}
                  readOnly
                  className="border-2 border-primary bg-primary/5 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 mb-2 block">Phone</Label>
                <Input
                  id="phone"
                  value={lead.phone}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Tour Interest and Assigned To Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tour" className="text-gray-700 mb-2 block">Tour Interest</Label>
                <Input
                  id="tour"
                  value={lead.tour?.title || 'Not specified'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="assigned" className="text-gray-700 mb-2 block">Assigned To</Label>
                <Input
                  id="assigned"
                  value={lead.assigned?.name || 'Unassigned'}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Email */}
            {lead.email && (
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 block">Email</Label>
                <Input
                  id="email"
                  value={lead.email}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            )}

            {/* Notes */}
            {lead.message && (
              <div>
                <Label htmlFor="notes" className="text-gray-700 mb-2 block">Notes</Label>
                <Textarea
                  id="notes"
                  value={lead.message}
                  readOnly
                  className="bg-gray-50 min-h-[80px]"
                />
              </div>
            )}

            {/* Status Badge */}
            <div>
              <Label className="text-gray-700 mb-2 block">Status</Label>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  lead.status === 'OPEN'
                    ? 'bg-blue-100 text-blue-800'
                    : lead.status === 'IN_PROGRESS'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${
                  lead.status === 'OPEN'
                    ? 'bg-blue-500'
                    : lead.status === 'IN_PROGRESS'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`} />
                {lead.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
            <Button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              variant="outline"
              className="border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Lead'}
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-2"
              >
                Close
              </Button>
              
              {lead.status !== 'CLOSED' && (
                <Button
                  onClick={handleConvert}
                  disabled={convertMutation.isPending}
                  className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary/30"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {convertMutation.isPending ? 'Converting...' : 'Convert to Booking'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
