import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, LogOut, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

export default function UserNavbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const isDashboard = location.pathname === '/user' || location.pathname === '/user/'
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('English')
    const [langMenuOpen, setLangMenuOpen] = useState(false)
    const dropdownRef = useRef(null)
    const categoryRef = useRef(null)

    const CATEGORIES = [
        { name: 'Indoor Plants', path: '/user/categories?category=Indoor Plants' },
        { name: 'Outdoor Plants', path: '/user/categories?category=Outdoor Plants' },
        { name: 'Flowering Plants', path: '/user/categories?category=Flowering Plants' },
        { name: 'Succulents & Cactus', path: '/user/categories?category=Succulents & Cactus' },
        { name: 'Herbs & Medicinal', path: '/user/categories?category=Herbs & Medicinal' },
        { name: 'Fruit Plants', path: '/user/categories?category=Fruit Plants' },
    ]

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            console.error("Failed to log out", error)
        }
    }

    return (
        <nav className={`bg-white border-b border-gray-100 transition-all duration-300 md:sticky md:top-0 md:z-[100] ${isScrolled ? 'md:shadow-sm' : ''}`} style={{ fontFamily: "'Inter', sans-serif", width: '100%' }}>

            {/* Sticky/Fixed Header for Mobile (Logo + Cart + Icons) */}
            <div className={`${isDashboard ? 'fixed top-0 left-0 right-0 z-[100]' : 'relative'} bg-white w-full px-6 sm:px-8 lg:px-20 border-b md:border-none border-gray-100 md:relative md:top-auto md:z-auto md:bg-transparent md:px-0`} style={{ maxWidth: '100%' }}>
                <div className={`flex items-center transition-all duration-300 ${isScrolled ? 'h-25' : 'h-15'}`}>

                    {/* Logo */}
                    <Link to="/user" className="flex items-center gap-2 !no-underline flex-shrink-0">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 bg-[#2d5a3d] rounded-[25px] sm:rounded-[18px] flex items-center justify-center">
                            <span className="text-white text-lg sm:text-lg">🌿</span>
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-[20px] sm:text-[20px] font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Nursery</span>
                            <span className="text-[10px] sm:text-[10px] text-[#2d5a3d] uppercase tracking-[0.15em] font-medium -mt-0.5">Marketplace</span>
                        </div>
                    </Link>

                    {/* Search Bar - Centered & Wider (Desktop Only) */}
                    <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-auto">
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search for plants, pots, seeds..."
                                className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 text-[13px] focus:outline-none focus:border-[#2d5a3d] focus:bg-white transition-all"
                                style={{ borderRadius: '18px' }}
                            />
                        </div>
                    </div>

                    {/* Nav Links - Center Right */}
                    <div className="hidden lg:flex items-center gap-6 ml-auto mr-6">
                        <NavLink
                            to="/user"
                            end
                            className={({ isActive }) => `text-[15px] font-medium !no-underline transition-all duration-200 pb-1 border-b-2 ${isActive ? 'border-[#2d5a3d]' : 'border-transparent hover:border-[#2d5a3d]/50'}`}
                            style={({ isActive }) => ({ color: isActive ? '#2d5a3d' : '#111827' })}
                        >
                            Home
                        </NavLink>

                        {/* Categories Dropdown */}
                        <div className="relative" ref={categoryRef}>
                            <button
                                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                className="flex items-center gap-1 text-[15px] font-medium transition-all duration-200 pb-1 border-b-2 border-transparent hover:border-[#2d5a3d]/50"
                                style={{ color: '#111827' }}
                            >
                                Categories
                                <ChevronDown size={14} className={`transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            <div
                                className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-[16px] shadow-lg border border-gray-100 py-2 z-50 transition-all duration-300 origin-top ${categoryDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                            >
                                {CATEGORIES.map((cat, index) => (
                                    <Link
                                        key={cat.name}
                                        to={cat.path}
                                        className="flex items-center px-4 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 !no-underline transition-colors"
                                        style={{ color: '#374151' }}
                                        onClick={() => setCategoryDropdownOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 ml-auto">
                        {/* Cart */}
                        <Link to="/user/cart" className="relative p-2 hover:bg-gray-50 rounded-[18px] transition-colors !no-underline">
                            <ShoppingCart size={19} className="text-gray-600 block sm:hidden w-6 h-6" />
                            <ShoppingCart size={19} className="text-gray-600 hidden sm:block" />
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-[#2d5a3d] rounded-full text-[8px] sm:text-[10px] font-bold text-white flex items-center justify-center">2</span>
                        </Link>

                        {/* Profile */}
                        <div className="relative hidden sm:block" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 py-1.5 px-2 rounded-[18px] hover:bg-gray-50 transition-all cursor-pointer outline-none"
                            >
                                <span className="hidden sm:block text-[15px] font-medium text-gray-700">
                                    {user?.email?.split('@')[0] || 'User'}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4ade80] to-[#2d5a3d] flex items-center justify-center">
                                    <span className="text-white font-semibold text-[15px]">
                                        {user?.email?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-[18px] shadow-lg border border-gray-100 py-2 z-50">
                                    <Link
                                        to="/user/profile"
                                        className="flex items-center gap-2 mx-2 px-3 py-2 text-[15px] hover:bg-gray-50 !no-underline transition-colors"
                                        style={{ color: '#111827', borderRadius: '12px' }}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <User size={15} /> My Profile
                                    </Link>
                                    <Link
                                        to="/user/orders"
                                        className="flex items-center gap-2 mx-2 px-3 py-2 text-[15px] hover:bg-gray-50 !no-underline transition-colors"
                                        style={{ color: '#111827', borderRadius: '12px' }}
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <ShoppingCart size={15} /> My Orders
                                    </Link>

                                    {/* Language Selector */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                                            className="flex items-center justify-between w-full mx-2 px-3 py-2 text-[15px] hover:bg-gray-50 transition-colors"
                                            style={{ color: '#111827', borderRadius: '12px', width: 'calc(100% - 16px)' }}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Globe size={15} /> {selectedLanguage}
                                            </span>
                                            <ChevronDown size={12} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {langMenuOpen && (
                                            <div className="bg-gray-50 py-1 mx-2" style={{ borderRadius: '12px' }}>
                                                {['English', 'Marathi', 'Hindi'].map(lang => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => {
                                                            setSelectedLanguage(lang)
                                                            setLangMenuOpen(false)
                                                        }}
                                                        className={`w-full text-left px-4 py-1.5 text-[14px] hover:bg-gray-100 ${selectedLanguage === lang ? 'text-[#2d5a3d] font-medium' : ''}`}
                                                        style={{ color: selectedLanguage === lang ? '#2d5a3d' : '#111827', borderRadius: '8px' }}
                                                    >
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <hr className="my-1 border-gray-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full mx-2 px-3 py-2 text-[15px] hover:bg-red-50 transition-colors"
                                        style={{ color: '#dc2626', borderRadius: '12px', width: 'calc(100% - 16px)' }}
                                    >
                                        <LogOut size={15} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer for Fixed Header on Mobile */}
            {isDashboard && (
                <div className={`md:hidden transition-all duration-300 ${isScrolled ? 'h-16' : 'h-16'}`}></div>
            )}

            <div className="w-full px-6 sm:px-8 lg:px-20" style={{ maxWidth: '100%' }}>
                {isDashboard && (
                    <>
                        {/* Mobile Search Bar - Visible only on small screens below the header */}
                        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isScrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'} px-1 pb-1 pt-1`}>
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                <input
                                    type="text"
                                    placeholder="Search plants..."
                                    className="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-[#2d5a3d] focus:bg-white transition-all font-sans"
                                    style={{ borderRadius: '18px', fontFamily: "'Inter', sans-serif" }}
                                />
                            </div>
                        </div>

                        {/* Condensed Mobile Search Label (visible when scrolled) */}
                        <div className={`md:hidden flex items-center justify-between overflow-hidden transition-all duration-300 ${isScrolled ? 'h-15 opacity-100 mt-2' : 'h-0 opacity-0'} pt-1`}>
                            <button className="flex items-center gap-2 bg-white px-4 py-1.5 border border-gray-100 w-full text-left h-full shadow-sm rounded-[18px]">
                                <Search size={15} className="text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Search plants...</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    )
}
