import { Outlet, useLocation } from 'react-router-dom'
import UserNavbar from '../components/UserNavbar'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import Breadcrumbs from '../components/Breadcrumbs'

export default function UserLayout() {
    const location = useLocation()
    const isDashboard = location.pathname === '/user' || location.pathname === '/user/'

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 overflow-y-auto no-scrollbar">

            {/* Top Navbar - Visible on all screens, adapts content */}
            <UserNavbar />

            {/* Breadcrumbs - Visible on all user pages except Dashboard */}
            {!isDashboard && <Breadcrumbs />}

            {/* Main Content */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Footer - Visible on all user pages, hidden on small screens */}
            <div className="hidden md:block">
                <Footer />
            </div>

            {/* Bottom Navigation - Visible only on mobile */}
            <BottomNav />
        </div>
    )
}
