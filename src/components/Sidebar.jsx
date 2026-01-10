import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROLES } from '../utils/roles'

const itemCls = ({ isActive }) => `block rounded-md px-3 py-2 text-sm hover:bg-slate-100 ${isActive ? 'bg-slate-100 font-medium' : ''}`

export default function Sidebar() {
  const { role } = useAuth()
  return (
    <aside className="h-full w-64 shrink-0 border-r border-slate-200 bg-white">
      <div className="p-4">
        <Link to="/dashboard" className="font-semibold">Dashboard</Link>
      </div>
      <nav className="space-y-1 p-2">
        {role === ROLES.SUPERADMIN && (
          <>
            <NavLink to="/superadmin" end className={itemCls}>Overview</NavLink>
            <NavLink to="/superadmin/users" className={itemCls}>Users</NavLink>
          </>
        )}
        {role === ROLES.ADMIN && (
          <>
            <NavLink to="/admin" end className={itemCls}>Overview</NavLink>
            <NavLink to="/admin/nurseries" className={itemCls}>Nurseries</NavLink>
            <NavLink to="/admin/sugarcanes" className={itemCls}>Sugarcanes</NavLink>
            <NavLink to="/admin/reports" className={itemCls}>Reports</NavLink>
          </>
        )}
        {role === ROLES.USER && (
          <>
            <NavLink to="/user" end className={itemCls}>Overview</NavLink>
            <NavLink to="/user/search" className={itemCls}>Nursery Search</NavLink>
            <NavLink to="/user/orders" className={itemCls}>Purchase History</NavLink>
          </>
        )}
      </nav>
    </aside>
  )
}
