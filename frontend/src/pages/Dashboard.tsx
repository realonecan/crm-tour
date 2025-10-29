import { useQuery } from '@tanstack/react-query'
import { TrendingUp, DollarSign, MapPin, Users } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Header } from '../components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { dashboardApi } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'

const COLORS = ['#0D9488', '#FB923C', '#EF4444']

export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats()
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  const kpiCards = [
    {
      title: 'Orders Today',
      value: stats?.ordersToday || 0,
      change: '+12% from yesterday',
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Weekly Revenue',
      value: formatCurrency(stats?.weeklyRevenue || 0),
      change: '+8% from last week',
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Active Tours',
      value: stats?.activeTours || 0,
      change: '',
      icon: MapPin,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      title: 'New Leads',
      value: stats?.newLeads || 0,
      change: '+23% from last week',
      icon: Users,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  const bookingStatusData = [
    { name: 'PAID', value: stats?.bookingsByStatus?.PAID || 0, label: 'Paid 55%' },
    { name: 'NEW', value: stats?.bookingsByStatus?.NEW || 0, label: 'New 35%' },
    { name: 'CANCELLED', value: stats?.bookingsByStatus?.CANCELLED || 0, label: 'Cancelled 10%' },
  ]

  return (
    <div>
      <Header title="Dashboard" />
      
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold">{card.value}</p>
                    {card.change && (
                      <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {card.change}
                      </p>
                    )}
                  </div>
                  <div className={`rounded-full p-3 ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Bookings Overview Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Bookings Overview (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.bookingsOverTime || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {bookingStatusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {bookingStatusData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-gray-600">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tours Table */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-600">
                    <th className="pb-3">Tour Name</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Group Size</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {stats?.upcomingTours?.map((tour: any) => (
                    <tr key={tour.id} className="border-b last:border-0">
                      <td className="py-4">{tour.tourTitle}</td>
                      <td className="py-4">{formatDate(tour.date)}</td>
                      <td className="py-4">{tour.bookedCount} / {tour.maxGroupSize} people</td>
                      <td className="py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          CONFIRMED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
