import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    slug: string
    icon: string
    color: string
  }) => void
}

export function CreateCategoryModal({ isOpen, onClose, onSubmit }: CreateCategoryModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    icon: '🏔️',
    color: '#00A86B',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-')
    onSubmit({ ...formData, slug })
    setFormData({ title: '', icon: '🏔️', color: '#00A86B' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">Create New Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="e.g., Adventure"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <div className="mt-1 flex items-center gap-3">
              <div
                className="h-10 w-16 rounded"
                style={{ backgroundColor: formData.color }}
              />
              <Input
                id="color"
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#00A86B"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🏔️"
              className="mt-1"
              maxLength={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary">
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
