import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/layout/Header'
import { Input } from '../components/ui/input'
import { CustomerProfileDrawer } from '../components/CustomerProfileDrawer'
import { customersApi } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'

export function Customers() {
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn: async () => {
      const params: any = {}
      if (search) params.q = search
      
      const response = await customersApi.getAll(params)
      return response.data.data
    },
  })

  return (
    <div>
      <Header title="Customers" />

      <div className="p-6 space-y-6">
        {/* Search */}
        <Input
          type="search"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        {/* Customers Table */}
        <div className="rounded-lg border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-600">
                <th className="p-4">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Total Bookings</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : customers?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers?.map((customer: any) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setSelectedCustomer(customer)}
                    className="border-b last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                          {customer.fullName?.charAt(0)}
                        </div>
                        <span className="font-medium">{customer.fullName}</span>
                      </div>
                    </td>
                    <td className="p-4">{customer.phone}</td>
                    <td className="p-4 text-blue-600">{customer.email || '-'}</td>
                    <td className="p-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                        {customer._count?.bookings || 0}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{formatCurrency(customer.totalSpent || 0)}</td>
                    <td className="p-4 text-gray-600">{formatDate(customer.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer */}
      <CustomerProfileDrawer
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  )
}
