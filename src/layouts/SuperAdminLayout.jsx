import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutGrid,
  Users,
  FileText,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";

/* ---------- Menu Config ---------- */
const MENU = [
  {
    to: "/superadmin/dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
    end: true,
  },
  {
    to: "/superadmin/users",
    label: "Manage Users",
    icon: Users,
    hasDropdown: true,
    submenu: [
      { to: "/superadmin/manageadmins", label: "Manage Admins" },
      { to: "/superadmin/manageusers", label: "Manage Users" },
    ],
  },
  { to: "/superadmin/reports", label: "Reports", icon: FileText },
  { to: "/superadmin/permissions", label: "Permissions", icon: Shield },
  { to: "/superadmin/settings", label: "Settings", icon: Settings },
];

/* ---------- Nav Item ---------- */
const NavItem = ({
  to,
  icon: Icon,
  label,
  end,
  collapsed,
  hasDropdown,
  submenu,
  isDropdownOpen,
  onToggleDropdown,
  onItemClick,
}) => {
  if (hasDropdown && !collapsed) {
    return (
      <div className={isDropdownOpen ? "" : "mb-2"}>
        <div
          onClick={onToggleDropdown}
          className={`flex items-center rounded-lg px-4 py-2 gap-3 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${isDropdownOpen
            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm"
            : "text-black hover:bg-gray-50 hover:shadow-sm"
            }`}
        >
          <Icon
            size={20}
            strokeWidth={2}
            className={isDropdownOpen ? "text-green-700" : "text-black"}
          />
          <span className="flex-grow text-[16px] font-medium whitespace-nowrap">{label}</span>
          {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? "max-h-40 opacity-100 mt-1 mb-1" : "max-h-0 opacity-0"
            }`}
        >
          <div className="flex flex-col gap-1.5">
            {submenu.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center px-5 py-2 ml-4 rounded-md text-[15px] font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02] no-underline ${isActive
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                    : "text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:shadow-sm"
                  }`
                }
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onItemClick}
      title={collapsed ? label : ""}
      className={({ isActive }) => {
        const base =
          "flex items-center rounded-md transition-all duration-300 ease-in-out transform hover:scale-[1.02] mb-1 no-underline";
        const spacing = collapsed
          ? "justify-center px-2 py-2"
          : "px-4 py-2 gap-3";
        const activeStyle = isActive
          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
          : "text-black hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm";

        return `${base} ${spacing} ${activeStyle}`;
      }}
      style={{ textDecoration: 'none' }}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={20}
            strokeWidth={isActive ? 2.5 : 2}
            className={isActive ? "text-white" : "text-black"}
          />
          {!collapsed && <span className="text-[16px] font-medium">{label}</span>}
        </>
      )}
    </NavLink>
  );
};

export default function SuperAdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for desktop sidebar collapse
  const [collapsed, setCollapsed] = useState(false);
  // State for mobile sidebar open/close
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for dropdowns
  const [openDropdownKey, setOpenDropdownKey] = useState(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleToggleDropdown = (key) => {
    setOpenDropdownKey(openDropdownKey === key ? null : key);
  };

  const handleItemClick = () => {
    // If on mobile, close menu when item is clicked
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col lg:flex-row">

      {/* Mobile Header (Visible only on small screens) */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-1.5 shadow-sm">
            <img src="/titleLogo.png" className="w-6 h-6 object-contain" alt="Logo" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Nursery Manager</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg lg:shadow-sm z-50 flex flex-col
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[70px]" : "lg:w-[260px] w-[280px]"}`}
      >
        {/* Sidebar Header (Hidden on Mobile as we have TopBar, visible on Desktop) */}
        <div
          className={`hidden lg:flex items-center justify-center border-b border-gray-100 relative transition-all duration-300 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 ${collapsed ? "min-h-[80px]" : "min-h-[140px]"
            }`}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3 w-full px-4">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-2 shadow-sm flex-shrink-0">
                <img
                  src="/titleLogo.png"
                  className="w-8 h-8 object-contain"
                  alt="Logo"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-gray-900 text-lg leading-tight">
                  Nursery Management
                </span>
                <span className="mt-0.5 px-2 py-0.5 text-[0.65rem] font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 rounded uppercase tracking-wider shadow-sm">
                  SuperAdmin
                </span>
              </div>
            </div>
          ) : (
            <img
              src="/titleLogo.png"
              className="w-8 h-8 object-contain"
              alt="Logo"
            />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors hidden lg:block"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Mobile Sidebar Header (Brand inside the sidebar for mobile only) */}
        <div className="lg:hidden p-6 border-b border-gray-100 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-2 shadow-sm flex-shrink-0">
              <img
                src="/titleLogo.png"
                className="w-8 h-8 object-contain"
                alt="Logo"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-bold text-gray-900 text-lg leading-tight">
                Nursery Management
              </span>
              <span className="mt-0.5 px-2 py-0.5 text-[0.65rem] font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 rounded uppercase tracking-wider shadow-sm">
                SuperAdmin
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="flex flex-col gap-2">
            {MENU.map((item) => (
              <NavItem
                key={item.to}
                {...item}
                collapsed={window.innerWidth >= 1024 ? collapsed : false}
                isDropdownOpen={openDropdownKey === item.to}
                onToggleDropdown={() => handleToggleDropdown(item.to)}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </nav>

        {/* Footer / Logout */}
        <div className="border-t border-gray-100 p-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg text-red-500 hover:bg-red-50 transition-colors ${collapsed ? "justify-center p-2" : "px-3 py-2 gap-2"
              }`}
          >
            <LogOut size={18} />
            {(!collapsed || window.innerWidth < 1024) && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main
        className="flex-1 min-w-0 transition-all duration-300 ease-in-out"
      >
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
