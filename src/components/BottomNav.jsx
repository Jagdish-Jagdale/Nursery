import { Home, Grid, ShoppingCart, User, Bell, Heart } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function BottomNav() {
    const navItems = [
        { to: '/user', icon: Home, label: 'Home' },
        { to: '/user/notifications', icon: Bell, label: 'Notifications' },
        { to: '/user/favorites', icon: Heart, label: 'Favorites' },
        { to: '/user/cart', icon: ShoppingCart, label: 'Cart' },
        { to: '/user/orders', icon: User, label: 'Account' }, // Mapping 'Account' to Orders for now as simple fallback
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 !no-underline ${isActive
                                ? 'bg-[#2d5a3d] !text-white scale-110 shadow-md shadow-green-900/20'
                                : '!text-gray-400 hover:!text-gray-600'
                            }`
                        }
                    >
                        <Icon size={20} className="mb-0.5" strokeWidth={2} />
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
