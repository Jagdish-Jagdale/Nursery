import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../utils/roles";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home,
  PlusCircle,
  List,
  Tag,
  BarChart2,
  CreditCard,
  Bell,
  UserPlus,
  Shield,
  FileBarChart,
  Menu,
  X,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

const NavItem = ({
  to,
  icon: Icon,
  children,
  badge,
  isSubItem = false,
  end = false,
}) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (!end && location.pathname.startsWith(to) && to !== "/");

  return (
    <NavLink
      to={to}
      end={end}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-md
        ${isActive
          ? "bg-success text-white"
          : "text-dark hover:bg-gray-100 hover:text-gray-900"
        }
        ${isSubItem ? "pl-12" : ""}
      `}
    >
      <Icon size={18} className={`${isActive ? "text-white" : "text-dark"}`} />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-l bg-success-subtle text-success">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="w-1 h-6 bg-success rounded-l absolute right-0"></div>
      )}
    </NavLink>
  );
};

const NavGroup = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();

  // Check if any child is active to keep the group open
  useEffect(() => {
    const hasActiveChild = React.Children.toArray(children).some((child) => {
      return child.props.to && location.pathname.startsWith(child.props.to);
    });
    if (hasActiveChild) setIsOpen(true);
  }, [location.pathname, children]);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className="text-gray-400" />}
          <span className="text-xs font-semibold tracking-wider">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
      </button>
      {isOpen && <div className="space-y-1 mt-1">{children}</div>}
    </div>
  );
};

export default function Sidebar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:bg-gray-50 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="d-flex flex-column align-items-center justify-content-center py-4 border-bottom">
          <Link
            to="/dashboard"
            className="text-decoration-none text-center w-100"
          >
            <div
              className="d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "70px", height: "70px" }}
            >
              <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded-3 w-100 h-100 shadow">
                <Home size={28} />
              </div>
            </div>
            <h4 className="fw-bold text-dark mb-1">Nursery</h4>
            <small className="text-muted">Admin</small>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 space-y-6">
          {/* Dashboard */}
          <div>
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Main
            </h3>
            <div className="space-y-1">
              <NavItem to="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavItem>
            </div>
          </div>

          {/* Applications */}
          <div>
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Applications
            </h3>
            <div className="space-y-1">
              <NavItem to="/ecommerce" icon={ShoppingCart}>
                E-Commerce
              </NavItem>
              <NavItem to="/analytics" icon={BarChart2}>
                Analytics
              </NavItem>
              <NavItem to="/inbox" icon={MessageSquare}>
                Inbox
              </NavItem>
            </div>
          </div>

          {/* Management */}
          <div>
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Management
            </h3>
            <NavGroup title="Users" icon={Users}>
              <NavItem to="/users/list" isSubItem>
                All Users
              </NavItem>
              <NavItem to="/users/roles" isSubItem>
                Roles & Permissions
              </NavItem>
              <NavItem to="/users/activity" isSubItem>
                Activity Log
              </NavItem>
            </NavGroup>

            <NavGroup title="Products" icon={Package} defaultOpen={false}>
              <NavItem to="/products/list" isSubItem>
                All Products
              </NavItem>
              <NavItem to="/products/categories" isSubItem>
                Categories
              </NavItem>
              <NavItem to="/products/inventory" isSubItem>
                Inventory
              </NavItem>
            </NavGroup>

            <NavItem to="/orders" icon={ShoppingCart} badge="3">
              Orders
            </NavItem>
            <NavItem to="/customers" icon={UserPlus}>
              Customers
            </NavItem>
          </div>

          {/* Support */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <NavItem to="/settings" icon={Settings}>
              Settings
            </NavItem>
            <NavItem to="/help" icon={HelpCircle}>
              Help Center
            </NavItem>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-left text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut size={18} className="mr-3 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{/* Page content will be rendered here */}</div>
        </main>
      </div>
    </div>
  );
}
