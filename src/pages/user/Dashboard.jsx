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
  { id: 'medicinal', name: 'Medicinal', image: 'https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'ornamental', name: 'Ornamental', image: 'https://images.pexels.com/photos/207518/pexels-photo-207518.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'climbers', name: 'Climbers', image: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'trees', name: 'Trees', image: 'https://images.pexels.com/photos/1179863/pexels-photo-1179863.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'shrubs', name: 'Shrubs', image: 'https://images.pexels.com/photos/1268558/pexels-photo-1268558.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'herbs', name: 'Herbs', image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'herbs', name: 'Herbs', image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { id: 'herbs', name: 'Herbs', image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=150' },

  { id: 'cacti', name: 'Cacti', image: 'https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=150' },
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
    <div className="mt-5 mb-4 relative -mx-6 sm:mx-5 lg:mx-12">
      <div className="flex items-center justify-between mb-1 px-6 sm:px-0">
        <h4 className="text-lg font-semibold font-serif text-gray-900">{title}</h4>
        <p className="text-sm font-semibold font-serif text-gray-900">See All</p>
      </div>
      <hr className="mb-4 border-gray-100" />

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
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth px-6 sm:px-0"
      >
        {products.map(product => (
          <Link
            key={product.id}
            to={`/user/product/${product.id}`}
            className="flex-none w-[160px] sm:w-[220px] md:w-[240px] lg:w-[250px] bg-white p-3 sm:p-4 rounded-[24px] sm:rounded-[32px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left !no-underline !text-gray-900 relative"
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
                  e.stopPropagation();
                  // Heart Logic
                }}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Image Area */}
            <div className="relative h-[120px] sm:h-[150px] lg:h-[180px] w-full mb-2 sm:mb-3 flex items-center justify-center">
              {product.new && (
                <span className="absolute top-0 right-0 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold text-white bg-green-500 rounded-full z-10 shadow-sm">
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
              <div className="flex items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-1 font-sans pt-1.5 sm:pt-0">
                <span className="text-base sm:text-xl font-bold text-[#b48a5f]">₹{typeof product.price === 'number' ? product.price.toFixed(0) : product.price}</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium">({product.delivery || '2 days'})</span>
              </div>

              <h5 className="text-sm sm:text-lg font-bold text-gray-900 my-1 sm:my-2 truncate font-serif tracking-tight group-hover:text-[#2d5a3d] transition-colors">{product.name}</h5>

              {/* Rating Section (Green Badge) */}
              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 font-sans">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${i >= Math.floor(product.rating) ? "text-gray-200" : ""}`} />
                  ))}
                </div>
                <span className="text-[9px] sm:text-[11px] text-gray-500 font-sans font-medium">({product.reviews} reviews)</span>
              </div>

              {/* Add to Cart Button */}
              <button
                style={{ borderRadius: "8px" }}
                className="w-full py-1.5 sm:py-2 bg-[#f0fdf4] hover:bg-[#2d5a3d] text-[#2d5a3d] hover:text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all border border-[#2d5a3d] flex items-center justify-center gap-1.5 sm:gap-2 mt-auto group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic
                }}
              >
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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

      // 64px is the height of the sticky header (h-16)
      // We trigger a bit earlier (80px) to ensure the animation completes smoothly
      const rect = categoryContainerRef.current.getBoundingClientRect()

      // Trigger well before the stick point
      setIsSticky(rect.top <= 80)
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
      <div className="w-full px-6 sm:px-8 lg:px-20 py-6">



        {/* Hero Section - Full Width with Sliding Animation */}
        <div className="relative w-full rounded-[24px] overflow-hidden min-h-[180px] sm:min-h-[320px] lg:min-h-[500px] mb-12 group/hero">

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
              <div className="relative z-10 flex items-center h-full min-h-[180px] sm:min-h-[320px] lg:min-h-[420px] px-8 lg:px-12">
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



        {/* Categories Section */}
        <div className="mb-10 lg:mb-14 py-6 relative group/cat border-y border-gray-200 -mx-6 sm:-mx-8 lg:-mx-20 px-6 sm:px-8 lg:px-20 bg-[#f8f9fa]">


          {/* Nav Buttons */}
          <button
            onClick={() => {
              if (categoryContainerRef.current) {
                categoryContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
              }
            }}
            className="hidden lg:flex absolute left-4 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full items-center justify-center text-[#2d5a3d] shadow-lg border border-gray-100 opacity-0 group-hover/cat:opacity-100 transition-opacity hover:bg-gray-50"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => {
              if (categoryContainerRef.current) {
                categoryContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }
            }}
            className="hidden lg:flex absolute right-4 top-[60%] -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full items-center justify-center text-[#2d5a3d] shadow-lg border border-gray-100 opacity-0 group-hover/cat:opacity-100 transition-opacity hover:bg-gray-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* Categories Row */}
          <div
            ref={categoryContainerRef}
            className={`flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar py-1 px-1 sm:px-8`}
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-3 min-w-[80px] sm:min-w-[100px] cursor-pointer group"
                onClick={() => navigate(`/user/categories?category=${cat.name}`)}
              >
                <div className={`w-18 h-18 sm:w-24 sm:h-24 rounded-full p-1 border-2 transition-all duration-300 ${activeCategory === cat.id ? 'border-[#b48a5f] scale-105 shadow-md' : 'border-transparent group-hover:border-gray-200'}`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {activeCategory === cat.id && (
                      <div className="absolute inset-0 bg-[#b48a5f]/10" />
                    )}
                  </div>
                </div>
                <span className={`text-sm font-medium transition-colors text-center ${activeCategory === cat.id ? 'text-[#b48a5f] font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>




        {/* Product Collections */}
        <ProductSection title="Trend Products" products={PRODUCTS} />
        <ProductSection title="Indoor Plants" products={[...PRODUCTS].reverse().slice(0, 8)} />
        <ProductSection title="Garden Essentials" products={[...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 8)} />
      </div>

    </div>
  )
}

