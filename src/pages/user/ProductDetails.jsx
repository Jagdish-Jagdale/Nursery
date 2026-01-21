import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft } from 'lucide-react'
import { PRODUCTS } from '../../data/mockData'

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        // Find product by ID (converted to number)
        const found = PRODUCTS.find(p => p.id === parseInt(id))
        if (found) {
            setProduct(found)
        } else {
            console.warn("Product not found for ID:", id)
            // Optional: don't navigate immediately to debug
            // navigate('/user') 
        }
    }, [id, navigate])

    if (!product) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#f8f9fa]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading product details...</p>
                </div>
            </div>
        )
    }

    // Mock data for multiple images (since main product has only one)
    const images = [
        product.image,
        "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400"
    ]

    // Mock data for reviews
    const reviews = [
        {
            id: 1,
            user: "Sarah Johnson",
            rating: 5,
            date: "2 days ago",
            comment: "Absolutely beautiful plant! Arrived in perfect condition and bigger than I expected. The packaging was eco-friendly too.",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
        },
        {
            id: 2,
            user: "Michael Chen",
            rating: 4,
            date: "1 week ago",
            comment: "Great quality, but the delivery was a day late. The plant itself is healthy and vibrant.",
            image: null
        },
        {
            id: 3,
            user: "Emily Davis",
            rating: 5,
            date: "2 weeks ago",
            comment: "I'm in love with this! It adds so much life to my living room. Highly recommend this nursery.",
            image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100"
        }
    ]

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    return (
        <div className="w-full min-h-screen bg-[#f8f9fa] pt-6 pb-12 px-6 sm:px-8 lg:px-12" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

            {/* Back Button */}
            <button
                onClick={() => navigate('/user')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#2d5a3d] mb-6 transition-colors font-medium group"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-[#2d5a3d] group-hover:bg-[#f0fdf4] transition-all">
                    <ArrowLeft size={16} />
                </div>
                Back to Dashboard
            </button>

            <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">

                    {/* Left Column - Image Gallery */}
                    <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 flex flex-col gap-6">
                        {/* Main Image Stage */}
                        <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                            <img
                                src={images[currentImageIndex]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Navigation Arrows */}
                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-[#2d5a3d] hover:scale-110 transition-all"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-[#2d5a3d] hover:scale-110 transition-all"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="absolute top-4 right-4">
                                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all scale-100 hover:scale-110">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#2d5a3d] shadow-md ring-2 ring-[#2d5a3d]/20' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="p-6 md:p-8 lg:p-10 lg:pl-0 flex flex-col h-full">

                        <div className="flex-1">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    {product.new && (
                                        <span className="px-3 py-1 bg-[#2d5a3d] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            New Arrival
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <span className="text-gray-900 font-bold ml-1">{product.rating}</span>
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-500 font-medium hover:text-[#2d5a3d] cursor-pointer underline decoration-gray-300 underline-offset-4 transition-colors">{product.reviews} Customer Reviews</span>
                                </div>

                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-xl font-bold text-[#2d5a3d]">₹{product.price}</span>
                                    <span className="text-sm text-gray-400 line-through mb-1">₹{product.price + 50}</span>
                                    <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-[10px] font-bold mb-1">-20%</span>
                                </div>
                                <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                            </div>

                            <hr className="border-gray-100 mb-8" />

                            {/* Description */}
                            <div className="prose prose-stone max-w-none text-gray-600 mb-8">
                                <p className="text-lg leading-relaxed mb-6">
                                    Bring nature into your home with this beautiful <strong>{product.name}</strong>. Known for its lush foliage and air-purifying qualities,
                                    it's the perfect addition to any living space. Easy to care for and adaptable to various light conditions.
                                    This plant is carefully selected from our premium nursery collection.
                                </p>

                                <h3 className="text-base font-bold text-gray-900 mb-3">Key Features</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <li className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xl">🌿</span>
                                        <span className="font-medium text-gray-800 text-sm">Air Purifying</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xl">💧</span>
                                        <span className="font-medium text-gray-800 text-sm">Low Water Needs</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xl">☀️</span>
                                        <span className="font-medium text-gray-800 text-sm">Indoor/Outdoor</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-xl">🐾</span>
                                        <span className="font-medium text-gray-800 text-sm">Pet Friendly</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-0 bg-white pt-3 pb-2 mt-auto border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center border border-gray-300 rounded-lg h-9 w-full sm:w-auto">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors rounded-l-lg border-r border-gray-300"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors rounded-r-lg border-l border-gray-300"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button className="flex-1 flex items-center justify-center gap-2 bg-[#2d5a3d] text-white h-9 rounded-lg font-medium text-sm hover:bg-[#234830] transition-all shadow-md shadow-green-900/10 active:scale-[0.99]">
                                    <ShoppingCart size={16} />
                                    Add to Cart • ₹{(product.price * quantity).toFixed(0)}
                                </button>

                                <button className="flex-1 sm:flex-none sm:w-32 flex items-center justify-center gap-2 bg-white text-[#2d5a3d] border border-[#2d5a3d] h-9 rounded-lg font-medium text-sm hover:bg-green-50 transition-all active:scale-[0.99]">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Reviews Section - Full Width Below */}
                <div className="p-6 md:p-8 lg:p-12 border-t border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 font-playfair">Customer Reviews ({product.reviews})</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 text-[#2d5a3d] rounded-full flex items-center justify-center font-bold text-base">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{review.user}</p>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{review.date}</span>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-3 min-h-[40px]">{review.comment}</p>

                                {review.image && (
                                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200 mt-auto group cursor-pointer">
                                        <img src={review.image} alt="User review" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button className="px-8 py-3 bg-white text-gray-700 font-semibold border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-[#2d5a3d] hover:border-[#2d5a3d] transition-all shadow-sm">
                            Load More Reviews
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}
