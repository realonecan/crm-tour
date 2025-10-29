import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { categoriesApi } from '../lib/api'
import { CreateCategoryModal } from '../components/modals/CreateCategoryModal'

export function Settings() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      alert('Category created successfully!')
    },
    onError: (error: any) => {
      alert(`Failed to create category: ${error.response?.data?.error?.message || error.message}`)
    },
  })

  const handleCreateCategory = (data: any) => {
    createMutation.mutate(data)
  }

  return (
    <div>
      <Header
        title="Settings"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-8">
            <button className="border-b-2 border-primary pb-3 text-sm font-medium text-primary">
              Categories
            </button>
            <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Notifications
            </button>
            <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              System Info
            </button>
          </nav>
        </div>

        <p className="text-gray-600">Manage your categories and their appearance</p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              Loading...
            </div>
          ) : categories?.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              No categories found
            </div>
          ) : (
            categories?.map((category: any) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon || '📦'}
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm" style={{ color: category.color }}>
                          {category.color}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-gray-600">✏️</button>
                      <button className="text-gray-400 hover:text-red-600">🗑️</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
