import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ChevronRight, ChevronLeft, Filter, ChevronDown, Check, Home } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import Breadcrumbs from '../../components/Breadcrumbs';

// Category circles with images
const CATEGORIES = [
    { id: 'all', name: 'All', image: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'indoor', name: 'Indoor', image: 'https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'outdoor', name: 'Outdoor', image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'flowering', name: 'Flowering', image: 'https://images.pexels.com/photos/701665/pexels-photo-701665.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'succulents', name: 'Succulents', image: 'https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'herbs', name: 'Herbs', image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: 'fruit', name: 'Fruit', image: 'https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg?auto=compress&cs=tinysrgb&w=150' },
]

export default function Categories() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'Plants';
    const [activeCategory, setActiveCategory] = useState('all');
    const [isSticky, setIsSticky] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const categoryContainerRef = useRef(null);

    // Sidebar Data (Static for UI matching)
    const filters = [
        {
            title: "Plants",
            items: ["Plants by Type", "Plants by Season", "Plants by Location", "Foliage Plants", "Flowering Plants", "Plants by Features Uses", "Plants by Color"]
        },
        {
            title: "Planters",
            items: ["Ceramic Planters", "Metal Planters", "Plastic Planters"]
        },
        {
            title: "Essentials",
            items: ["Fertilizers", "Soil", "Tools"]
        }
    ];

    const sortOptions = ["Best selling", "Price: Low to High", "Price: High to Low", "Newest"];

    const handleCategoryClick = (category) => {
        setSearchParams({ category });
    };

    // Sticky behavior for category circles
    useEffect(() => {
        const checkPosition = () => {
            if (!categoryContainerRef.current) {
                return
            }
            const rect = categoryContainerRef.current.getBoundingClientRect()
            setIsSticky(rect.top <= 80)
        }

        const intervalId = setInterval(checkPosition, 50)
        window.addEventListener('scroll', checkPosition, { capture: true })
        window.addEventListener('resize', checkPosition)

        return () => {
            clearInterval(intervalId)
            window.removeEventListener('scroll', checkPosition, { capture: true })
            window.removeEventListener('resize', checkPosition)
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
            {/* Category Circles - Sticky on small screens, hidden on large screens */}
            <div
                ref={categoryContainerRef}
                className={`lg:hidden sticky top-[56px] z-50 transition-all duration-300 ${isSticky ? 'bg-white backdrop-blur-md shadow-md' : 'bg-transparent'}`}
                style={{
                    paddingTop: '5spx',
                }}
            >
                <div
                    id="category-scroll"
                    className="flex items-center justify-start gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 py-2"
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                navigate(`/user/categories?category=${encodeURIComponent(cat.name)}`);
                            }}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 flex-shrink-0 group`}
                        >
                            <div className={`rounded-full overflow-hidden transition-all duration-300 ${isSticky ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16'} ${activeCategory === cat.id ? 'ring-2 ring-[#2d5a3d] ring-offset-2' : 'group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-2'}`}>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <span className={`transition-all duration-300 text-center ${isSticky ? 'text-[10px] font-medium text-gray-700' : 'text-[10px] sm:text-xs text-gray-600'} ${activeCategory === cat.id ? 'text-[#2d5a3d] font-bold' : ''}`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 w-full justify-center"
                        >
                            <Filter size={16} />
                            Filter Plants & Products
                        </button>
                    </div>

                    {/* Mobile Sidebar Overlay */}
                    {mobileFiltersOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm transition-opacity"
                            onClick={() => setMobileFiltersOpen(false)}
                        />
                    )}

                    {/* Left Sidebar - Drawer on Mobile, Static on Desktop */}
                    <aside
                        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none lg:w-64 lg:block flex-shrink-0 overflow-y-auto lg:overflow-visible p-6 lg:p-0 ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ChevronLeft size={24} />
                            </button>
                        </div>

                        {/* Detailed Filters Section */}
                        <div className="mt-8 pt-0 border-t-0 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 text-base uppercase tracking-wider">Refine By</h3>
                                <button className="text-xs text-[#2d5a3d] font-bold hover:underline uppercase tracking-wide">Clear</button>
                            </div>

                            {/* Price */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                                    Price Range
                                    <ChevronDown size={14} className="text-gray-400" />
                                </h4>
                                <div className="space-y-3">
                                    {['Under ₹200', '₹200 - ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'].map((label, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center group-hover:border-[#2d5a3d] transition-colors bg-white peer-checked:bg-[#2d5a3d] peer-checked:border-[#2d5a3d]">
                                                {/* Checkbox visual would be handled by state */}
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                                    Delivery Speed
                                </h4>
                                <div className="space-y-3">
                                    {['Same Day Delivery', 'Next Day Delivery', 'Standard Shipping'].map((label, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-[#2d5a3d] transition-colors bg-white">
                                                {i === 2 && <div className="w-2.5 h-2.5 rounded-full bg-[#2d5a3d]"></div>}
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4">Customer Rating</h4>
                                <div className="space-y-2">
                                    {[4, 3, 2, 1].map((rating, i) => (
                                        <label key={i} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors -ml-1">
                                            <div className="flex items-center gap-0.5 text-yellow-500">
                                                {[...Array(5)].map((_, r) => (
                                                    <Star key={r} size={14} fill={r < rating ? "currentColor" : "currentColor"} className={r >= rating ? "text-gray-200" : ""} />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 font-medium">& Up</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4">Color Family</h4>
                                <div className="flex flex-wrap gap-3">
                                    {['#2d5a3d', '#E6A57E', '#ef4444', '#eab308', '#3b82f6', '#a855f7', '#ffffff', '#000000'].map((color, i) => (
                                        <button
                                            key={i}
                                            className={`w-8 h-8 rounded-full border-2 border-gray-100 shadow-sm hover:scale-110 hover:border-gray-300 transition-all ${color === '#ffffff' ? 'bg-white' : ''}`}
                                            style={{ backgroundColor: color }}
                                            title="Color"
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>


                    {/* Right Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div className="text-sm text-gray-500">
                                <span>Sort by</span>
                                <select className="ml-2 border-none bg-transparent font-medium text-gray-900 focus:ring-0 cursor-pointer text-sm">
                                    {sortOptions.map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">View as</span>
                                <div className="flex gap-1">
                                    <button className="p-1.5 text-[#2d5a3d] bg-green-50 rounded"><div className="w-4 h-4 grid grid-cols-2 gap-0.5"><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div></div></button>
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600"><div className="w-4 h-4 flex flex-col gap-0.5"><div className="bg-current h-1 rounded-[1px]"></div><div className="bg-current h-1 rounded-[1px]"></div><div className="bg-current h-1 rounded-[1px]"></div></div></button>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {PRODUCTS.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/user/product/${p.id}`}
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="bg-white p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left relative border border-gray-100 !no-underline !text-gray-900"
                                >
                                    {/* Top Row: Variants & Wishlist */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1 bg-gray-100/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6A57E]"></div>
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2d5a3d]"></div>
                                        </div>
                                        <button
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Heart Logic
                                            }}
                                        >
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Image Area */}
                                    <div className="relative h-[120px] sm:h-[150px] w-full mb-2 sm:mb-3 flex items-center justify-center">
                                        {p.new && (
                                            <span className="absolute top-0 right-0 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-white bg-green-500 rounded-full z-10 shadow-sm">
                                                NEW
                                            </span>
                                        )}
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="max-w-full max-h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Content Area */}
                                    <div className="mt-auto">
                                        {p.discount > 0 ? (
                                            <span className="bg-red-50 text-red-600 text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded mb-1 sm:mb-2 inline-block">Save {p.discount}%</span>
                                        ) : <div className="h-4 sm:h-5"></div>}

                                        <div className="flex items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-1 mt-1">
                                            <span className="text-sm sm:text-lg font-bold text-[#b48a5f]">₹{typeof p.price === 'number' ? p.price.toFixed(0) : p.price}</span>
                                            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">({p.delivery || '2 days'})</span>
                                        </div>

                                        <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-1 truncate font-serif tracking-tight group-hover:text-[#2d5a3d] transition-colors">{p.name}</h3>

                                        {/* Rating Section (Green Badge) */}
                                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                            <div className="flex items-center gap-0.5 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} fill={i < Math.floor(p.rating) ? "currentColor" : "none"} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i >= Math.floor(p.rating) ? "text-gray-200" : ""}`} />
                                                ))}
                                            </div>
                                            <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium">({p.reviews})</span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            style={{ borderRadius: "8px" }}
                                            className="w-full py-1.5 sm:py-2 bg-[#f0fdf4] hover:bg-[#2d5a3d] text-[#2d5a3d] hover:text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all border border-[#2d5a3d] flex items-center justify-center gap-1.5 sm:gap-2 mt-auto group/btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Add to cart logic
                                            }}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            Add to Cart
                                        </button>
                                    </div>

                                    {/* Offer message matching ref image */}

                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
