import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Protected from "./components/Protected";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import OwnerLayout from "./layouts/OwnerLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleRedirect from "./components/RoleRedirect";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageOwners from "./pages/admin/ManageOwners";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminReports from "./pages/admin/Reports";
import Permissions from "./pages/admin/Permissions";
import AdminSettings from "./pages/admin/Settings";
import OwnerDashboard from "./pages/owner/Dashboard";
import AddProduct from "./pages/owner/AddProduct";
import OwnerOrders from "./pages/owner/Orders";
import OwnerReports from "./pages/owner/Reports";
import OwnerSettings from "./pages/owner/Settings";
import UserOverview from "./pages/user/Overview";
import Search from "./pages/user/Search";
import Orders from "./pages/user/Orders";
import { ROLES } from "./utils/roles";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* ADMIN (formerly SuperAdmin) */}
        <Route element={<Protected roles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
            <Route path="/admin/manageowners" element={<ManageOwners />} />
            <Route
              path="/admin/manageusers"
              element={<ManageUsers />}
            />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/permissions" element={<Permissions />} />
            <Route
              path="/admin/settings"
              element={<AdminSettings />}
            />
          </Route>
        </Route>

        {/* OWNER (formerly Admin) */}
        <Route element={<Protected roles={[ROLES.OWNER]} />}>
          <Route element={<OwnerLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/addproduct" element={<AddProduct />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
            <Route path="/owner/reports" element={<OwnerReports />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
          </Route>
        </Route>

        {/* USER */}
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
  );
}

export default App;
