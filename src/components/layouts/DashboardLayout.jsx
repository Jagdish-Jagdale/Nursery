import { Outlet } from 'react-router-dom'
import UserNavbar from '../UserNavbar'
import BottomNav from '../BottomNav'

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-y-auto no-scrollbar">

      {/* Top Navbar - Visible on all screens, adapts content */}
      <UserNavbar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Bottom Navigation - Visible only on mobile */}
      <BottomNav />
    </div>
  )
}
