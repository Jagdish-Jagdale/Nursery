import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Protected from './components/Protected'
import DashboardLayout from './components/layouts/DashboardLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RoleRedirect from './components/RoleRedirect'
import SuperAdminOverview from './pages/superadmin/Overview'
import UsersManage from './pages/superadmin/Users'
import AdminOverview from './pages/admin/Overview'
import Nurseries from './pages/admin/Nurseries'
import Sugarcanes from './pages/admin/Sugarcanes'
import Reports from './pages/admin/Reports'
import UserOverview from './pages/user/Overview'
import Search from './pages/user/Search'
import Orders from './pages/user/Orders'
import { ROLES } from './utils/roles'

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RoleRedirect />} />

          <Route element={<Protected roles={[ROLES.SUPERADMIN]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/superadmin" element={<SuperAdminOverview />} />
              <Route path="/superadmin/users" element={<UsersManage />} />
            </Route>
          </Route>

          <Route element={<Protected roles={[ROLES.ADMIN]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/nurseries" element={<Nurseries />} />
              <Route path="/admin/sugarcanes" element={<Sugarcanes />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>
          </Route>

          <Route element={<Protected roles={[ROLES.USER]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/user" element={<UserOverview />} />
              <Route path="/user/search" element={<Search />} />
              <Route path="/user/orders" element={<Orders />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
