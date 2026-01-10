import { Bell, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Page Title / Breadcrumb area */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
          <Bell size={20} />
        </button>

        {/* User Avatar & Email */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-semibold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">Welcome!</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
