import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROLES } from '../utils/roles'
import {
  LayoutDashboard,
  Users,
  Trees,
  Sprout,
  FileChartColumn,
  Search,
  ShoppingBag,
  Flower2,
  LogOut
} from 'lucide-react'

const NavItem = ({ to, icon: Icon, children, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
      ${isActive
        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
    `}
  >
    <Icon size={20} />
    <span>{children}</span>
  </NavLink>
)

export default function Sidebar() {
  const { role, logout } = useAuth()

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Flower2 size={22} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            Nursery
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {role === ROLES.SUPERADMIN && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </p>
            <NavItem to="/superadmin" icon={LayoutDashboard} end>Overview</NavItem>
            <NavItem to="/superadmin/users" icon={Users}>Users</NavItem>
          </>
        )}

        {role === ROLES.ADMIN && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Management
            </p>
            <NavItem to="/admin" icon={LayoutDashboard} end>Overview</NavItem>
            <NavItem to="/admin/nurseries" icon={Trees}>Nurseries</NavItem>
            <NavItem to="/admin/sugarcanes" icon={Sprout}>Inventory</NavItem>
            <NavItem to="/admin/reports" icon={FileChartColumn}>Reports</NavItem>
          </>
        )}

        {role === ROLES.USER && (
          <>
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </p>
            <NavItem to="/user" icon={LayoutDashboard} end>Overview</NavItem>
            <NavItem to="/user/search" icon={Search}>Find Plants</NavItem>
            <NavItem to="/user/orders" icon={ShoppingBag}>My Orders</NavItem>
          </>
        )}
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
