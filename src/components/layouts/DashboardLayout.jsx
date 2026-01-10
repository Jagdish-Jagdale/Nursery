import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Sidebar from '../Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[16rem_1fr]">
        <Sidebar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
