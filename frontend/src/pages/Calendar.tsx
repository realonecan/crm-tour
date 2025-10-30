import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/button'
import { tourDatesApi, categoriesApi } from '../lib/api'
import { CreateTourDateModal } from '../components/modals/CreateTourDateModal'
import { TourDateDetailsModal } from '../components/modals/TourDateDetailsModal'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTourDate, setSelectedTourDate] = useState<any>(null)

  // Fetch tour dates
  const { data: tourDates } = useQuery({
    queryKey: ['tour-dates'],
    queryFn: async () => {
      const response = await tourDatesApi.getAll()
      return response.data.data
    },
  })

  // Fetch categories for color coding
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data.data
    },
  })

  // Get category color
  const getCategoryColor = (categoryId: number) => {
    const category = categories?.find((c: any) => c.id === categoryId)
    return category?.color || '#0D9488'
  }

  // Calendar calculations
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }, [startingDayOfWeek, daysInMonth])

  // Get tours for a specific day
  const getToursForDay = (day: number) => {
    if (!tourDates) return []
    
    const dateToCheck = new Date(year, month, day)
    
    return tourDates.filter((td: any) => {
      const tourDate = new Date(td.date)
      return (
        tourDate.getFullYear() === dateToCheck.getFullYear() &&
        tourDate.getMonth() === dateToCheck.getMonth() &&
        tourDate.getDate() === dateToCheck.getDate()
      )
    })
  }

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Get unique categories from visible tours
  const visibleCategories = useMemo(() => {
    if (!categories || !tourDates) return []
    
    const categoryIds = new Set(
      tourDates.map((td: any) => td.tour?.categoryId).filter(Boolean)
    )
    
    return categories.filter((c: any) => categoryIds.has(c.id))
  }, [categories, tourDates])

  return (
    <div>
      <Header title="Tour Calendar" />

      <div className="p-6 space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {MONTHS[month]} {year}
            </h2>

            <button
              onClick={goToNextMonth}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <Button className="bg-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Tour Date
          </Button>
        </div>

        {/* Category Legend */}
        {visibleCategories.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Categories:</span>
            <div className="flex flex-wrap gap-4">
              {visibleCategories.map((category: any) => (
                <div key={category.id} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-700">{category.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="rounded-lg border bg-white overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b bg-gray-50">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const tours = day ? getToursForDay(day) : []

              return (
                <div
                  key={index}
                  className={`min-h-[140px] border-b border-r p-3 ${
                    !day ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {day && (
                    <>
                      <div className="mb-2 text-sm text-gray-600">
                        {day}
                      </div>
                      <div className="space-y-1">
                        {tours.map((tourDate: any) => (
                          <div
                            key={tourDate.id}
                            className="rounded px-2 py-1.5 text-xs font-medium text-white truncate cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: getCategoryColor(tourDate.tour?.categoryId),
                            }}
                            title={`${tourDate.tour?.title} - ${tourDate.tour?.category?.title}`}
                            onClick={() => setSelectedTourDate(tourDate)}
                          >
                            {tourDate.tour?.title}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTourDateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TourDateDetailsModal
        isOpen={!!selectedTourDate}
        onClose={() => setSelectedTourDate(null)}
        tourDate={selectedTourDate}
      />
    </div>
  )
}
