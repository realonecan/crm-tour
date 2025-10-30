import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { tourDatesApi } from '../../lib/api'

interface TourDateDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  tourDate: any
}

export function TourDateDetailsModal({ isOpen, onClose, tourDate }: TourDateDetailsModalProps) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    groupSize: '',
    availableSeats: '',
    priceOverride: '',
  })

  // Initialize form data when tourDate changes
  useEffect(() => {
    if (tourDate) {
      const dateObj = new Date(tourDate.date)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')

      setFormData({
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        groupSize: tourDate.maxGroupSize?.toString() || '',
        availableSeats: tourDate.maxGroupSize?.toString() || '',
        priceOverride: tourDate.priceOverride?.toString() || '',
      })
    }
  }, [tourDate])

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await tourDatesApi.update(tourDate.id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-dates'] })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await tourDatesApi.delete(tourDate.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-dates'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const dateTime = `${formData.date}T${formData.time}:00.000Z`
    
    updateMutation.mutate({
      date: dateTime,
      maxGroupSize: parseInt(formData.groupSize),
      priceOverride: formData.priceOverride ? parseFloat(formData.priceOverride) : null,
    })
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tour date?')) {
      deleteMutation.mutate()
    }
  }

  if (!isOpen || !tourDate) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getCategoryColor = () => {
    return tourDate.tour?.category?.color || '#0D9488'
  }

  const getCategoryName = () => {
    return tourDate.tour?.category?.title || 'Uncategorized'
  }

  const getPrice = () => {
    return tourDate.priceOverride || tourDate.tour?.price || 0
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Tour Date Details</h2>

        {!isEditing ? (
          <div className="space-y-4">
            {/* Tour Name */}
            <div>
              <Label>Tour</Label>
              <div className="mt-1 rounded-lg border-2 border-primary bg-primary/5 px-4 py-3">
                <span className="font-medium text-primary">
                  {tourDate.tour?.title}
                </span>
              </div>
            </div>

            {/* Date and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <div className="mt-1 text-gray-900">
                  {formatDate(tourDate.date)}
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <div className="mt-1">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: getCategoryColor() }}
                  >
                    {getCategoryName().toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Group Size */}
            <div>
              <Label>Max Group Size</Label>
              <div className="mt-1 text-gray-900">{tourDate.maxGroupSize}</div>
            </div>

            {/* Price */}
            <div>
              <Label>Price</Label>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                ${getPrice()}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  type="button"
                  className="bg-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Tour Date
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tour Name (Read-only) */}
            <div>
              <Label>Tour</Label>
              <div className="mt-1 rounded-lg border bg-gray-50 px-4 py-3 text-gray-700">
                {tourDate.tour?.title}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {/* Max Group Size */}
            <div>
              <Label htmlFor="groupSize">Max Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                className="mt-1"
                required
                min="1"
              />
            </div>

            {/* Price Override */}
            <div>
              <Label htmlFor="priceOverride">Price Override (Optional)</Label>
              <Input
                id="priceOverride"
                type="number"
                step="0.01"
                value={formData.priceOverride}
                onChange={(e) => setFormData({ ...formData, priceOverride: e.target.value })}
                placeholder="Leave empty to use base price"
                className="mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
