import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Star, ShoppingCart,
    Heart, Minus, Plus, ArrowLeft, Share2, ShieldCheck,
    Truck, RefreshCw, Home
} from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const found = PRODUCTS.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
        } else {
            console.warn("Product not found for ID:", id);
        }
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2d5a3d] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading details...</p>
                </div>
            </div>
        );
    }

    const images = [
        product.image,
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1599598425947-d352e008aa3e?auto=format&fit=crop&q=80&w=600"
    ];

    const reviews = [
        {
            id: 1,
            user: "Sarah Johnson",
            rating: 5,
            date: "2 days ago",
            comment: "Absolutely beautiful plant! Arrived in perfect condition and bigger than I expected. The packaging was eco-friendly too.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
        },
        {
            id: 2,
            user: "Michael Chen",
            rating: 4,
            date: "1 week ago",
            comment: "Great quality, but the delivery was a day late. The plant itself is healthy and vibrant.",
            image: null
        }
    ];

    const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

    const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center text-sm text-gray-500">
                    <Link to="/user" className="hover:text-[#2d5a3d] flex items-center gap-1">
                        <Home size={14} /> Home
                    </Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="cursor-pointer hover:text-[#2d5a3d]">Plants</span>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-900 font-medium truncate">{product.name}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* Left: Gallery */}
                        <div className="p-6 lg:p-10 bg-gray-50/30">
                            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4 group cursor-zoom-in">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                                            }`}
                                    >
                                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-[#2d5a3d] hover:text-white transition-all">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="pointer-events-auto w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-[#2d5a3d] hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${currentImageIndex === idx ? 'border-[#2d5a3d] ring-2 ring-[#2d5a3d]/10' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="p-6 lg:p-10 flex flex-col">
                            <div className="mb-auto">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star size={16} fill="currentColor" />
                                                <span className="font-bold text-gray-900">{product.rating}</span>
                                            </div>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-gray-500">{product.reviews} Reviews</span>
                                            <span className="text-gray-300">|</span>
                                            <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-[#2d5a3d] transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>

                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-4xl font-bold text-[#2d5a3d]">₹{product.price}</span>
                                    <span className="text-xl text-gray-400 line-through">₹{product.price + 150}</span>
                                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full uppercase tracking-wide">Save 20%</span>
                                </div>

                                <div className="prose prose-stone text-gray-600 mb-8">
                                    <p>
                                        Transform your space with the {product.name}. Carefully selected for its vibrant foliage and air-purifying properties, this plant is perfect for both beginners and enthusiasts.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2d5a3d] shadow-sm">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Quality</p>
                                            <p className="text-sm font-medium text-gray-900">Guaranteed</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2d5a3d] shadow-sm">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Delivery</p>
                                            <p className="text-sm font-medium text-gray-900">2-3 Days</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">Quantity</span>
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-[#2d5a3d] text-white h-12 rounded-xl font-semibold shadow-lg shadow-[#2d5a3d]/20 hover:bg-[#234830] transition-all flex items-center justify-center gap-2">
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </button>
                                        <button className="flex-1 bg-white border-2 border-[#2d5a3d] text-[#2d5a3d] h-12 rounded-xl font-semibold hover:bg-green-50 transition-all">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6 lg:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">Customer Reviews</h2>
                            <button className="text-[#2d5a3d] font-medium text-sm hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4ade80] to-[#2d5a3d] flex items-center justify-center text-white font-bold">
                                                {review.user[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{review.user}</p>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((p) => (
                            <div key={p.id} onClick={() => navigate(`/user/product/${p.id}`)} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500">
                                            <Heart size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-1">{p.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-[#2d5a3d]">₹{p.price}</span>
                                        <button className="w-8 h-8 rounded-full bg-[#f0fdf4] text-[#2d5a3d] flex items-center justify-center hover:bg-[#2d5a3d] hover:text-white transition-colors">
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
