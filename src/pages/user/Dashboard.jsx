import { useState, useRef } from 'react'
import { ShoppingCart, ShoppingBag, ChevronDown, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { PRODUCTS } from '../../data/mockData'

// Helper categories with images
const CATEGORIES = [
  { id: 'all', name: 'All', image: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'indoor', name: 'Indoor', image: 'https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'outdoor', name: 'Outdoor', image: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'flowering', name: 'Flowering', image: 'https://images.pexels.com/photos/701665/pexels-photo-701665.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'succulents', name: 'Succulents', image: 'https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'herbs', name: 'Herbs', image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'fruit', name: 'Fruit', image: 'https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg?auto=compress&cs=tinysrgb&w=150' },
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
    <div className="mt-12 mb-4 relative mx-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <button
        onClick={() => scroll('left')}
        className="hidden lg:flex absolute -left-15 top-[55%] -translate-y-1/2 z-50 w-12 h-12 !rounded-full bg-white/90 !backdrop-blur-md shadow-2xl border-2 border-white items-center justify-center text-[#2d5a3d] hover:scale-110 transition-all"
      >
        <ChevronLeft size={28} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden lg:flex absolute -right-15 top-[55%] -translate-y-1/2 z-50 w-12 h-12 !rounded-full bg-white/90 !backdrop-blur-md shadow-2xl border-2 border-white items-center justify-center text-[#2d5a3d] hover:scale-110 transition-all"
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
            className="flex-none w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] bg-white p-4 rounded-[32px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left !no-underline !text-gray-900 relative"
          >
            {/* Top Row: Variants & Wishlist */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 bg-gray-100/80 px-2 py-1 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#E6A57E]"></div>
                <div className="w-2 h-2 rounded-full bg-[#2d5a3d]"></div>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Heart Logic
                }}
              >
                <Heart size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Image Area */}
            <div className="relative h-[150px] w-full mb-3 flex items-center justify-center">
              {product.new && (
                <span className="absolute top-0 right-0 px-2 py-1 text-[10px] font-bold text-white bg-green-500 rounded-full z-10 shadow-sm">
                  NEW
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Content Area */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xl font-bold text-[#b48a5f]">₹{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{typeof product.price === 'number' ? (product.price * 1.2).toFixed(0) : product.price}</span>
              </div>

              <h5 className="text-lg font-bold text-gray-900 my-2 truncate font-serif tracking-tight group-hover:text-[#2d5a3d] transition-colors">{product.name}</h5>

              {/* Rating Section (Green Badge) */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-200" : ""} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 font-medium">({product.reviews} reviews)</span>
              </div>

              {/* Add to Cart Button */}
              <button
                style={{ borderRadius: "8px" }}
                className="w-full py-2 bg-[#f0fdf4] hover:bg-[#2d5a3d] text-[#2d5a3d] hover:text-white text-xs font-bold rounded-xl transition-all border border-[#2d5a3d] flex items-center justify-center gap-2 mt-auto group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic
                }}
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div >
  )
}

export default function Dashboard() {
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

        {/* Circular Categories Grid */}
        <div className="relative mb-6 lg:mb-10 px-0 sm:px-8 group/cat">
          <button
            onClick={() => {
              const container = document.getElementById('category-scroll');
              if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
            }}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-[#2d5a3d] hover:scale-110 transition-all opacity-0 group-hover/cat:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => {
              const container = document.getElementById('category-scroll');
              if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
            }}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-[#2d5a3d] hover:scale-110 transition-all opacity-0 group-hover/cat:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          <div
            id="category-scroll"
            className="flex items-start justify-start lg:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-2 sm:py-4 px-2"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/user/categories?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-2 sm:gap-3 group flex-shrink-0"
              >
                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300 ${activeCategory === cat.id ? 'ring-2 ring-[#2d5a3d] ring-offset-2' : 'group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-2'}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className={`text-[10px] sm:text-sm font-medium transition-colors ${activeCategory === cat.id ? 'text-[#2d5a3d] font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

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
                  className="h-[180px] sm:h-[280px] lg:h-[340px] object-contain drop-shadow-2xl"
                />
                {/* Small plant beside */}
                <img
                  src="https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Small Plant"
                  className="h-[80px] sm:h-[120px] lg:h-[160px] object-contain drop-shadow-xl -ml-2 sm:-ml-4 mb-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Circular Categories Grid */}


        {/* Product Collections */}
        <ProductSection title="Trend Products" products={PRODUCTS} />
        <ProductSection title="Indoor Plants" products={[...PRODUCTS].reverse().slice(0, 8)} />
        <ProductSection title="Garden Essentials" products={[...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 8)} />
      </div>

    </div >
  )
}

