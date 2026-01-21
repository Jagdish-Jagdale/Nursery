import { Star, Heart } from 'lucide-react'

export default function ProductCard({ product }) {
    const { name, price, originalPrice, rating, image, discount } = product

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group">
            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100">
                <Heart size={18} />
            </button>

            {/* Image */}
            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px] leading-relaxed group-hover:text-green-700 transition-colors">
                    {name}
                </h3>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-100">
                        {rating} <Star size={10} fill="currentColor" />
                    </div>
                    <span className="text-xs text-gray-400">(1.2k)</span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-base">₹{price}</span>
                    <span className="text-xs text-gray-400 line-through decoration-gray-300">₹{originalPrice}</span>
                </div>

                {/* Free Delivery Badge */}
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Free delivery
                    </span>
                </div>
            </div>
        </div>
    )
}
