import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home,
  UserPlus,
  MessageSquare,
  BarChart2,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import React from 'react';

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
      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group
        ${isActive
          ? "bg-green-50 text-green-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
        ${isSubItem ? "pl-12" : ""}
      `}
    >
      {Icon && <Icon size={18} className={`transition-colors ${isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"}`} />}
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="w-1 h-6 bg-green-600 rounded-l absolute right-0"></div>
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
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} />}
          <span>{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown size={14} />
        ) : (
          <ChevronRight size={14} />
        )}
      </button>
      {isOpen && <div className="space-y-1 mt-1">{children}</div>}
    </div>
  );
};

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:static lg:translate-x-0 flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-gray-100">
          <Link
            to="/dashboard"
            className="flex flex-col items-center gap-3 group px-6"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 transition-transform group-hover:scale-105 overflow-hidden p-1">
              <img
                src="/titleLogo.png"
                alt="Nursery Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">Nursery</h4>
              <div className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider inline-block mt-1">
                Management
              </div>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-8 custom-scrollbar">
          {/* Main */}
          <div>
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
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
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
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
            <h3 className="px-4 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Management
            </h3>
            <NavGroup title="Users" icon={Users}>
              <NavItem to="/users/list" isSubItem>
                All Users
              </NavItem>
              <NavItem to="/users/roles" isSubItem>
                Roles & Permissions
              </NavItem>
            </NavGroup>

            <NavGroup title="Products" icon={Package} defaultOpen={false}>
              <NavItem to="/products/list" isSubItem>
                All Products
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="space-y-1">
            <NavItem to="/settings" icon={Settings}>
              Settings
            </NavItem>
            <NavItem to="/help" icon={HelpCircle}>
              Help Center
            </NavItem>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-2"
            >
              <LogOut size={18} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
