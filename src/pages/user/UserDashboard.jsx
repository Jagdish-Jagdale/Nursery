import { useState, useRef } from 'react'
import { ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { PRODUCTS } from '../../data/mockData'

// Helper categories
const CATEGORIES = [
  { id: 'all', name: 'All', icon: null },
  { id: 'indoor', name: 'Indoor Plants', icon: '🌱' },
  { id: 'outdoor', name: 'Outdoor Plants', icon: '🌳' },
  { id: 'flowering', name: 'Flowering Plants', icon: '🌸' },
  { id: 'succulents', name: 'Succulents & Cactus', icon: '🌵' },
  { id: 'herbs', name: 'Herbs & Medicinal', icon: '🌿' },
  { id: 'fruit', name: 'Fruit Plants', icon: '' },
]

const ProductSection = ({ title, products, onProductClick }) => {
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="mt-12 mb-4 relative">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute -left-12 top-[55%] -translate-y-1/2 z-50 w-12 h-12 !rounded-full bg-white/90 !backdrop-blur-md shadow-2xl border-2 border-white items-center justify-center text-[#2d5a3d] hover:scale-110 transition-all"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute -right-12 top-[55%] -translate-y-1/2 z-50 w-12 h-12 !rounded-full bg-white/90 !backdrop-blur-md shadow-2xl border-2 border-white items-center justify-center text-[#2d5a3d] hover:scale-110 transition-all"
      >
        <ChevronRight size={28} strokeWidth={2.5} />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth"
      >
        {products.map(product => (
          <Link
            key={product.id}
            to={`/user/product/${product.id}`}
            className="min-w-[calc(50%-8px)] md:min-w-[calc(25%-12px)] lg:min-w-[calc(20%-13px)] bg-white p-3 border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left !no-underline !text-gray-900"
            style={{ borderRadius: '16px', minHeight: '180px' }}
          >
            <div className="relative h-[200px] w-full mb-1.5 bg-[#f5f5f5] overflow-hidden" style={{ borderRadius: '8px' }}>
              <button
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                style={{ borderRadius: '50%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Heart Logic
                }}
              >
                <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
              {product.new && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-bold text-white bg-green-500" style={{ borderRadius: '6px' }}>
                  NEW
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="!text-[16px] font-semibold !text-black mb-0.5 truncate">{product.name}</h3>
            <div className="flex items-center gap-1 mb-1">
              <div className="flex items-center gap-0.5 px-1 py-0.5 bg-green-600 text-white" style={{ borderRadius: '4px' }}>
                <span className="text-[10px] font-bold">{product.rating}</span>
                <Star size={8} className="fill-white" />
              </div>
              <span className="text-[10px] text-gray-400">({product.reviews})</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <span className={`text-[10px] ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>●</span>
              <span className={`text-[10px] ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-lg font-bold text-gray-900">₹{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
            </div>
            <button
              className="w-full py-1.5 text-white text-[10px] font-semibold transition-colors bg-[#2d5a3d] hover:bg-[#234830]"
              style={{ borderRadius: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here (future)
              }}
            >
              Add to Cart
            </button>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const [activeCategory, setActiveCategory] = useState('all')
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()

  const handleProductClick = (product) => {
    navigate(`/user/product/${product.id}`)
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div className="w-full px-6 sm:px-8 lg:px-12 py-6">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Hero Section - Left */}
          <div className="lg:col-span-2 relative bg-gradient-to-r from-[#f5ebe0] via-[#ebe0d4] to-[#e8ddd0] rounded-[24px] overflow-hidden p-6 lg:p-8 min-h-[200px]">
            {/* Decorative Shape */}
            <div className="absolute right-0 top-0 w-2/3 h-full pointer-events-none">
              <svg viewBox="0 0 400 300" className="absolute right-0 top-0 h-full w-full">
                <path d="M180,20 Q320,40 360,140 Q390,220 300,260 Q200,290 140,240 Q80,190 100,100 Q120,20 180,20" fill="#d4c4b0" opacity="0.4" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[55%]">
              <p className="text-[10px] text-gray-500 font-medium mb-1.5 tracking-wide">Fully - Home Product</p>
              <h1 className="text-[28px] lg:text-[34px] font-semibold text-gray-900 leading-[1.15] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Plant for Interior<br />Decoration
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-500">Start from</span>
                <span className="px-2.5 py-1 bg-[#2d5a3d] text-white text-sm font-bold rounded-lg">$220</span>
              </div>
              <button className="text-[11px] font-semibold text-gray-700 underline underline-offset-4 decoration-1 hover:text-[#2d5a3d] transition-colors tracking-wide">
                SHOP NOW
              </button>
            </div>

            {/* Hero Image - Rose */}
            <div className="absolute right-2 lg:right-6 bottom-0 w-36 lg:w-44 h-44 lg:h-52">
              <img
                src="https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Rose Plant"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Monstera Card */}
            <div className="relative bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] rounded-[20px] p-4 overflow-hidden min-h-[105px]">
              <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest mb-1">Claim Fresh Scents</p>
              <h3 className="text-[19px] font-semibold text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Monsera</h3>
              <p className="text-[10px] text-gray-500 mb-2">Start from $12</p>
              <button className="px-3 py-1 bg-white text-[10px] font-semibold text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                SHOP Plan at
              </button>
              <div className="absolute right-1 bottom-0 w-20 h-24">
                <img src="https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Monstera" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Plant for Garden Card */}
            <div className="relative bg-gradient-to-br from-[#2d5a3d] to-[#1e3d2a] rounded-[20px] p-4 overflow-hidden min-h-[105px] text-white">
              <p className="text-[9px] text-white/60 font-medium uppercase tracking-widest mb-1">A Quality Home</p>
              <h3 className="text-base font-semibold mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Plant for Garden</h3>
              <button className="text-[10px] font-semibold underline underline-offset-2 hover:text-green-200 transition-colors tracking-wide">
                SHOP NOW
              </button>
              <div className="absolute right-1 bottom-0 w-16 h-20">
                <img src="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Garden Plant" className="w-full h-full object-contain opacity-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {/* Category Tabs */}
        <div className="bg-white flex items-center justify-between mt-8 mb-6 p-1.5 shadow-sm border border-gray-100" style={{ borderRadius: '12px' }}>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto px-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${activeCategory === cat.id
                    ? 'bg-[#2d5a3d] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                style={{ borderRadius: '15px' }}
              >
                {cat.icon && <span className="text-xs">{cat.icon}</span>}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Collections */}
        <ProductSection title="Trend Products" products={PRODUCTS} />
        <ProductSection title="Indoor Plants" products={[...PRODUCTS].reverse().slice(0, 8)} />
        <ProductSection title="Garden Essentials" products={[...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 8)} />
      </div>

      {/* Professional Footer - Full Width */}
      <footer className="w-full bg-[#2d5a3d] text-white block">
        {/* Main Footer Content */}
        <div className="px-6 sm:px-8 lg:px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-[12px] flex items-center justify-center">
                  <span className="text-white text-xl">🌿</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[18px] font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Nursery</span>
                  <span className="text-[9px] text-white/70 uppercase tracking-[0.15em]">Marketplace</span>
                </div>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed mb-4">
                Your one-stop destination for beautiful plants, flowers, and gardening essentials. Bringing nature closer to you.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-[14px]">𝕏</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-[14px]">📘</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-[14px]">📸</span>
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-[14px]">▶️</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[15px] font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Shop Plants</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Categories</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>My Orders</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Wishlist</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-[15px] font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Contact Us</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>FAQs</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Shipping Info</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Returns & Refunds</a></li>
                <li><a href="#" className="text-[13px] text-white/70 hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.7)' }}>Plant Care Guide</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-[15px] font-semibold mb-4">Stay Updated</h4>
              <p className="text-[13px] text-white/70 mb-4">Subscribe to get updates on new arrivals and special offers.</p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/50 text-[13px] focus:outline-none focus:border-white/40 transition-colors"
                  style={{ borderRadius: '10px' }}
                />
                <button
                  className="w-full px-4 py-2.5 bg-white text-[#2d5a3d] text-[13px] font-bold hover:bg-white/90 transition-colors"
                  style={{ borderRadius: '10px' }}
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[11px] text-white/50 mt-3">By subscribing, you agree to our Privacy Policy.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-10 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-white/60">© 2025 Nursery Marketplace. All rights reserved.</p>
              <div className="flex items-center gap-6 text-[12px] text-white/60">
                <a href="#" className="hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.6)' }}>Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.6)' }}>Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors !no-underline" style={{ color: 'rgba(255,255,255,0.6)' }}>Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}

