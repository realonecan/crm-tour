import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { tourDatesApi, toursApi } from '../../lib/api'

interface CreateTourDateModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedDate?: Date
}

export function CreateTourDateModal({ isOpen, onClose, preselectedDate }: CreateTourDateModalProps) {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    tourId: '',
    date: '',
    time: '',
    groupSize: '',
    priceOverride: '',
  })

  // Fetch tours for dropdown
  const { data: tours } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const response = await toursApi.getAll()
      return response.data.data
    },
  })

  // Set preselected date if provided
  useEffect(() => {
    if (preselectedDate) {
      const year = preselectedDate.getFullYear()
      const month = String(preselectedDate.getMonth() + 1).padStart(2, '0')
      const day = String(preselectedDate.getDate()).padStart(2, '0')
      setFormData(prev => ({ ...prev, date: `${year}-${month}-${day}` }))
    }
  }, [preselectedDate])

  // Auto-fill group size when tour is selected
  useEffect(() => {
    if (formData.tourId && tours) {
      const selectedTour = tours.find((t: any) => t.id === parseInt(formData.tourId))
      if (selectedTour) {
        setFormData(prev => ({
          ...prev,
          groupSize: selectedTour.groupSize?.toString() || '',
        }))
      }
    }
  }, [formData.tourId, tours])

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await tourDatesApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-dates'] })
      onClose()
      resetForm()
    },
  })

  const resetForm = () => {
    setFormData({
      tourId: '',
      date: '',
      time: '',
      groupSize: '',
      priceOverride: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const dateTime = `${formData.date}T${formData.time}:00.000Z`
    
    createMutation.mutate({
      tourId: parseInt(formData.tourId),
      date: dateTime,
      maxGroupSize: parseInt(formData.groupSize),
      priceOverride: formData.priceOverride ? parseFloat(formData.priceOverride) : undefined,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Add New Tour Date</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Tour */}
          <div>
            <Label htmlFor="tour">Select Tour</Label>
            <Select
              value={formData.tourId}
              onValueChange={(value) => setFormData({ ...formData, tourId: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a tour" />
              </SelectTrigger>
              <SelectContent>
                {tours?.map((tour: any) => (
                  <SelectItem key={tour.id} value={tour.id.toString()}>
                    {tour.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Adding...' : 'Add Tour Date'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
