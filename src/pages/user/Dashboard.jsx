import { useState, useRef, useEffect } from 'react'
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

const HERO_SLIDES = [
  {
    id: 1,
    bg: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: <span className="font-serif">Plant for<br />Interior<br />Decoration</span>,
    subtitle: 'Start from',
    price: '$20',
    img: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=600',
    subImg: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 2,
    bg: 'https://images.pexels.com/photos/796602/pexels-photo-796602.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: <span className="font-serif">Fresh<br />Breath<br />Everyday</span>,
    subtitle: 'Air Purifying',
    price: '$15',
    img: 'https://images.pexels.com/photos/3094208/pexels-photo-3094208.jpeg?auto=compress&cs=tinysrgb&w=600',
    subImg: 'https://images.pexels.com/photos/3653198/pexels-photo-3653198.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 3,
    bg: 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg?auto=compress&cs=tinysrgb&w=1200',
    title: <span className="font-serif">Green<br />Corner<br />Special</span>,
    subtitle: 'Succulents',
    price: '$12',
    img: 'https://images.pexels.com/photos/1903965/pexels-photo-1903965.jpeg?auto=compress&cs=tinysrgb&w=600',
    subImg: 'https://images.pexels.com/photos/1454228/pexels-photo-1454228.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
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
              <div className="flex items-baseline gap-2 mb-1 font-sans">
                <span className="text-xl font-bold  text-[#b48a5f]">₹{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{typeof product.price === 'number' ? (product.price * 1.2).toFixed(0) : product.price}</span>
              </div>

              <h5 className="text-lg font-bold text-gray-900 my-2 truncate font-serif tracking-tight group-hover:text-[#2d5a3d] transition-colors">{product.name}</h5>

              {/* Rating Section (Green Badge) */}
              <div className="flex items-center gap-2 mb-3 font-sans">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-gray-200" : ""} />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500  font-sans font-medium">({product.reviews} reviews)</span>
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

  const [isSticky, setIsSticky] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const categoryContainerRef = useRef(null)

  useEffect(() => {
    // Polling is robust against whatever container is handling the scroll
    const checkPosition = () => {
      if (!categoryContainerRef.current) return

      const width = window.innerWidth
      if (width >= 1024) {
        setIsSticky(false)
        return
      }

      // 112px is the perfect stack height.
      // We trigger MUCH earlier (180px) to ensure the animation completes
      // BEFORE it physically hits the navbar.
      const rect = categoryContainerRef.current.getBoundingClientRect()

      // Trigger well before the stick point
      setIsSticky(rect.top <= 180)
    }

    const intervalId = setInterval(checkPosition, 50)

    // Also check on scroll for immediate feedback if possible
    window.addEventListener('scroll', checkPosition, { capture: true })
    window.addEventListener('resize', checkPosition)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('scroll', checkPosition, { capture: true })
      window.removeEventListener('resize', checkPosition)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const width = window.innerWidth
      console.log('Scroll Debug:', { scrollY, width, isSticky: scrollY > 50 })

      // Force sticky behavior check on every scroll for mobile
      if (width < 1024) {
        // Fallback check
        if (!isSticky && scrollY > 50) setIsSticky(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSticky])

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
    <div className="w-full min-h-screen bg-[#f8f9fa]" >
      <div className="w-full px-6 sm:px-8 lg:px-12 py-6">




        {/* Hero Section - Full Width with Sliding Animation */}
        <div className="relative w-full rounded-[24px] overflow-hidden min-h-[180px] sm:min-h-[320px] lg:min-h-[380px] mb-8 group/hero">

          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Background Image with blur effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                style={{
                  backgroundImage: `url('${slide.bg}')`,
                  filter: 'blur(2px) brightness(1.05)',
                  transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.0)'
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f5ebe0]/95 via-[#f5ebe0]/80 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex items-center h-full min-h-[180px] sm:min-h-[320px] lg:min-h-[380px] px-8 lg:px-12">
                <div className={`max-w-[45%] transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                  <h1 className="text-[32px] lg:text-[44px] font-medium text-gray-900 leading-[1.1] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {slide.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600">{slide.subtitle}</span>
                    <span className="px-3 py-1.5 bg-[#2d5a3d] text-white text-base font-bold rounded-lg shadow-md">{slide.price}</span>
                  </div>
                </div>

                {/* Hero Image Group */}
                <div className="absolute right-4 lg:right-12 bottom-0 w-[50%] lg:w-[45%] h-full flex items-end justify-center pointer-events-none">
                  <div className="relative flex items-end gap-2">
                    <img
                      src={slide.img}
                      alt="Main Plant"
                      className={`h-[140px] sm:h-[180px] lg:h-[340px] object-contain drop-shadow-2xl transition-all duration-1000 delay-500 transform ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}
                    />
                    {slide.subImg && (
                      <img
                        src={slide.subImg}
                        alt="Sub Plant"
                        className={`h-[60px] sm:h-[80px] lg:h-[160px] object-contain drop-shadow-xl -ml-2 sm:-ml-4 mb-2 transition-all duration-1000 delay-700 transform ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#2d5a3d]' : 'bg-gray-400/50 hover:bg-[#2d5a3d]/50'}`}
              />
            ))}
          </div>

        </div>



        {/* Circular Categories Grid */}
        <div
          ref={categoryContainerRef}
          className={`sticky lg:relative top-[113px] lg:top-auto z-40 transition-all duration-300  mb-6 lg:mb-10 px-0 sm:px-8 group/cat ${isSticky ? 'backdrop-blur-md shadow-sm -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12' : ''}`}
          style={{
            backgroundColor: isSticky ? '#ffffff' : 'transparent',
            paddingTop: isSticky ? '12px' : ''
          }}
        >
          <button
            onClick={() => {
              const container = document.getElementById('category-scroll');
              if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
            }}
            className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-[#2d5a3d] hover:scale-110 transition-all opacity-0 group-hover/cat:opacity-100 ${isSticky ? 'left-4' : ''}`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => {
              const container = document.getElementById('category-scroll');
              if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
            }}
            className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center text-gray-600 hover:text-[#2d5a3d] hover:scale-110 transition-all opacity-0 group-hover/cat:opacity-100 ${isSticky ? 'right-4' : ''}`}
          >
            <ChevronRight size={20} />
          </button>

          <div
            id="category-scroll"
            className="flex items-center justify-start lg:justify-center gap-3 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/user/categories?category=${encodeURIComponent(cat.name)}`)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 flex-shrink-0 group`}
              >
                <div className={`rounded-full overflow-hidden transition-all duration-300 ${isSticky ? 'w-12 h-12' : 'w-14 h-14 sm:w-20 sm:h-20'} ${!isSticky && activeCategory === cat.id ? 'ring-2 ring-[#2d5a3d] ring-offset-2' : 'group-hover:ring-2 group-hover:ring-gray-200 group-hover:ring-offset-2'}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <span className={`transition-all duration-300 text-center ${isSticky ? "text-xs sm:text-sm font-medium text-gray-700" : "text-[10px] sm:text-sm text-gray-600"} ${activeCategory === cat.id ? 'text-[#2d5a3d] font-bold' : ''}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>




        {/* Product Collections */}
        <ProductSection title="Trend Products" products={PRODUCTS} />
        <ProductSection title="Indoor Plants" products={[...PRODUCTS].reverse().slice(0, 8)} />
        <ProductSection title="Garden Essentials" products={[...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 8)} />
      </div>

    </div >
  )
}

