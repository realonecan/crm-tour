import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Phone } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Input } from '../components/ui/input'
import { LeadDetailsModal } from '../components/LeadDetailsModal'
import { leadsApi } from '../lib/api'
import { getRelativeTime } from '../lib/utils'

export function Leads() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All Status')
  const [selectedLead, setSelectedLead] = useState<any>(null)

  const { data: leads } = useQuery({
    queryKey: ['leads', search, statusFilter],
    queryFn: async () => {
      const params: any = {}
      if (search) params.q = search
      if (statusFilter !== 'All Status') params.status = statusFilter
      
      const response = await leadsApi.getAll(params)
      return response.data.data
    },
  })

  const groupedLeads = {
    OPEN: leads?.filter((l: any) => l.status === 'OPEN') || [],
    IN_PROGRESS: leads?.filter((l: any) => l.status === 'IN_PROGRESS') || [],
    CLOSED: leads?.filter((l: any) => l.status === 'CLOSED') || [],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'border-orange-300'
      case 'IN_PROGRESS':
        return 'border-blue-300'
      case 'CLOSED':
        return 'border-green-300'
      default:
        return 'border-gray-300'
    }
  }

  return (
    <div>
      <Header title="Leads Management" />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <Input
            type="search"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option>All Status</option>
            <option>OPEN</option>
            <option>IN_PROGRESS</option>
            <option>CLOSED</option>
          </select>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Object.entries(groupedLeads).map(([status, items]) => (
            <div key={status} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${
                  status === 'OPEN' ? 'bg-orange-500' :
                  status === 'IN_PROGRESS' ? 'bg-blue-500' :
                  'bg-green-500'
                }`} />
                <span className="font-medium">{status.replace('_', ' ')}</span>
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                  {items.length}
                </span>
              </div>

              {/* Lead Cards */}
              <div className="space-y-3">
                {items.map((lead: any) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer rounded-lg border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${getStatusColor(lead.status)}`}
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{lead.name}</h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      </div>

                      {lead.tour && (
                        <div className="text-sm">
                          <span className="text-gray-500">Tour Interest:</span>
                          <p className="font-medium">{lead.tour.title}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{lead.assigned?.name || 'John Doe'}</span>
                        <span>{getRelativeTime(lead.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                    No {status.toLowerCase().replace('_', ' ')} leads
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  )
}
