import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Users,
  UserCircle,
  BookOpen,
  UserCog,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tours', href: '/tours', icon: MapPin },
  { name: 'Bookings', href: '/bookings', icon: BookOpen },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Customers', href: '/customers', icon: UserCircle },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Users', href: '/users', icon: UserCog, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const filteredNav = navigation.filter(
    (item) => !item.adminOnly || user?.role === 'ADMIN'
  )

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-primary to-primary-700 text-white shadow-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-primary-600/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
          <MapPin className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">TourCRM</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {filteredNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
              )
            }
          >
            <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="relative border-t border-white/10 p-4">
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex w-full items-center gap-3 rounded-xl bg-white/10 p-3 transition-all hover:bg-white/15"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary text-sm font-bold shadow-md">
            {user?.name?.charAt(0) || 'JD'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold truncate">{user?.name || 'John Doe'}</p>
            <p className="text-xs text-primary-200">{user?.role || 'Admin'}</p>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isProfileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <div className="absolute bottom-full left-4 right-4 mb-2 z-20 rounded-xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2">
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  // Navigate to profile
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
