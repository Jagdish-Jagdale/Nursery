import { Home, Grid, ShoppingCart, User, Bell } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function BottomNav() {
    const navItems = [
        { to: '/user', icon: Home, label: 'Home' },
        { to: '/user/search', icon: Grid, label: 'Categories' },
        { to: '/user/notifications', icon: Bell, label: 'Notifications' },
        { to: '/user/cart', icon: ShoppingCart, label: 'Cart' },
        { to: '/user/orders', icon: User, label: 'Account' }, // Mapping 'Account' to Orders for now as simple fallback
    ]

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span className="text-[10px] font-medium">{label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
