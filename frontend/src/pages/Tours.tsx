import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, MoreVertical, Image as ImageIcon } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { toursApi, categoriesApi } from '../lib/api'
import { formatCurrency } from '../lib/utils'
import { CreateTourModal } from '../components/modals/CreateTourModal'

export function Tours() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: tours, isLoading } = useQuery({
    queryKey: ['tours', search, statusFilter],
    queryFn: async () => {
      const params: any = {}
      if (search) params.q = search
      if (statusFilter !== 'All Status') params.status = statusFilter
      
      const response = await toursApi.getAll(params)
      return response.data.data
    },
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const slug = data.title.toLowerCase().replace(/\s+/g, '-')
      return toursApi.create({ ...data, slug, categoryId: categories?.[0]?.id || 1 })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] })
      alert('Tour created successfully!')
    },
    onError: (error: any) => {
      alert(`Failed to create tour: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  const handleCreateTour = (data: any) => {
    createMutation.mutate(data)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'HARD':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'EASY':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'PUBLISHED'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  return (
    <div>
      <Header
        title="Tours Management"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Tour
          </Button>
        }
      />

      <CreateTourModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTour}
        categories={categories}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option>All Status</option>
            <option>PUBLISHED</option>
            <option>DRAFT</option>
          </select>
        </div>

        {/* Tours Table */}
        <div className="rounded-lg border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                <th className="p-4">Cover</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : tours?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No tours found
                  </td>
                </tr>
              ) : (
                tours?.map((tour: any) => (
                  <tr key={tour.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        {tour.cover ? (
                          <img src={tour.cover} alt={tour.title} className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{tour.title}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 uppercase">
                        {tour.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase ${getDifficultyColor(tour.difficulty)}`}>
                        {tour.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{formatCurrency(tour.basePrice)}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase ${getStatusColor(tour.status)}`}>
                        {tour.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="rounded-lg p-2 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
