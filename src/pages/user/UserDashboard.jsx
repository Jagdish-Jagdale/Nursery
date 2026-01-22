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
            className="min-w-[calc(50%-8px)] md:min-w-[calc(25%-12px)] lg:min-w-[calc(20%-13px)] bg-white p-3 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left !no-underline !text-gray-900"
            style={{ borderRadius: '16px', minHeight: '180px' }}
          >
            <div className="relative h-[180px] w-full mb-2 bg-white overflow-hidden flex items-center justify-center" style={{ borderRadius: '12px' }}>
              <button
                className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10"
                style={{ borderRadius: '50%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Heart Logic
                }}
              >
                <Heart size={14} className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
              {product.new && (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold text-white bg-green-500 z-10" style={{ borderRadius: '6px' }}>
                  NEW
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
              />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white" style={{ borderRadius: '4px' }}>
                <span className="text-[10px] font-bold">{product.rating}</span>
                <Star size={8} className="fill-white" />
              </div>
              <span className="text-[10px] text-gray-400">({product.reviews})</span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-lg font-bold text-gray-900">₹{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
              <button
                className="px-3 py-1.5 text-white text-[10px] font-semibold transition-colors bg-[#2d5a3d] hover:bg-[#234830]"
                style={{ borderRadius: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic here (future)
                }}
              >
                Add to Cart
              </button>
            </div>
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

        {/* Hero Section - Full Width with Natural Background */}
        <div className="relative w-full rounded-[24px] overflow-hidden min-h-[320px] lg:min-h-[380px] mb-8">
          {/* Background Image with blur effect */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
              filter: 'blur(2px) brightness(1.05)',
              transform: 'scale(1.1)'
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5ebe0]/95 via-[#f5ebe0]/80 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex items-center h-full min-h-[320px] lg:min-h-[380px] px-8 lg:px-12">
            <div className="max-w-[45%]">
              <h1 className="text-[32px] lg:text-[44px] font-medium text-gray-900 leading-[1.1] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Plant for<br />Interior<br />Decoration
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Start from</span>
                <span className="px-3 py-1.5 bg-[#2d5a3d] text-white text-base font-bold rounded-lg shadow-md">$20</span>
              </div>
            </div>

            {/* Hero Image - Red Rose in Pot with Small Plant */}
            <div className="absolute right-4 lg:right-12 bottom-0 w-[50%] lg:w-[45%] h-full flex items-end justify-center pointer-events-none">
              {/* Main Rose Image */}
              <div className="relative flex items-end gap-2">
                <img
                  src="https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Red Rose Plant"
                  className="h-[280px] lg:h-[340px] object-contain drop-shadow-2xl"
                />
                {/* Small plant beside */}
                <img
                  src="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Small Plant"
                  className="h-[120px] lg:h-[160px] object-contain drop-shadow-xl -ml-4 mb-2"
                />
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

