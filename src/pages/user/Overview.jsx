import { Search, SlidersHorizontal } from 'lucide-react'
import ProductCard from '../../components/ProductCard'

// Mock Data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Money Plant Variegated (Pothos)",
    price: 299,
    originalPrice: 499,
    discount: 40,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Snake Plant (Sansevieria)",
    price: 349,
    originalPrice: 599,
    discount: 42,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599598425947-640a3f9c6566?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Peace Lily (Spathiphyllum)",
    price: 499,
    originalPrice: 799,
    discount: 37,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1593691509543-c55cead2e037?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Rubber Plant (Ficus Elastica)",
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1598887142487-3c834d93482a?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "Aloe Vera Plant",
    price: 199,
    originalPrice: 299,
    discount: 33,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1596547610029-46eaff10eac3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Monstera Deliciosa",
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&auto=format&fit=crop&q=60"
  }
]

const CATEGORIES = [
  { id: 1, name: "Indoor", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=100&q=60" },
  { id: 2, name: "Outdoor", image: "https://images.unsplash.com/photo-1599598425947-640a3f9c6566?w=100&q=60" },
  { id: 3, name: "Flowering", image: "https://images.unsplash.com/photo-1593691509543-c55cead2e037?w=100&q=60" },
  { id: 4, name: "Succulents", image: "https://images.unsplash.com/photo-1596547610029-46eaff10eac3?w=100&q=60" },
  { id: 5, name: "Pots", image: "https://images.unsplash.com/photo-1598887142487-3c834d93482a?w=100&q=60" },
]

export default function UserOverview() {
  return (
    <div className="space-y-10 pb-12">

      {/* Mobile Search Bar (Visible on small screens) */}
      <div className="lg:hidden relative">
        <input
          type="text"
          placeholder="Search for plants, pots, seeds..."
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:border-green-500 shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Hero Banner Carousel */}
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-gradient-to-r from-emerald-800 to-green-600 rounded-3xl overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 flex items-center p-8 md:p-14 text-white z-10">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase shadow-sm">
              New Arrivals
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-sm">
              Bring Nature <br className="hidden md:block" /> Into Your Home
            </h2>
            <p className="text-emerald-100/90 text-base md:text-lg max-w-md font-medium leading-relaxed">
              Transform your living space with our curated collection of indoor plants. Get <span className="text-white font-bold">40% off</span> this week.
            </p>
            <button className="mt-2 px-8 py-3.5 bg-white text-emerald-800 font-bold rounded-xl shadow-lg hover:bg-emerald-50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 transform active:scale-95">
              Shop Now
            </button>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute right-40 bottom-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Categories Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Shop By Category</h3>
          <a href="#" className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">View All</a>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-3 shadow-md group-hover:shadow-xl transition-all duration-300 bg-gray-50 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300"></div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-0 right-0 text-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    Explore
                  </span>
                </div>
              </div>
              <p className="text-center font-semibold text-gray-700 group-hover:text-green-700 transition-colors text-sm md:text-base">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-end gap-3">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recommended for You</h3>
            <span className="text-sm text-gray-500 font-medium mb-1">Based on your activity</span>
          </div>
          <button className="p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors border border-gray-100 hover:border-gray-200">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-6">
          {MOCK_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  )
}
