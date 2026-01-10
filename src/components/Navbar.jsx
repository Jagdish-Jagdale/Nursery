import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="font-semibold">Nursery Management</Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:block">{user?.email}</span>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 hover:bg-slate-100">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  )
}
