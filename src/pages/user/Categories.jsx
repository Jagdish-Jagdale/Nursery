import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ChevronRight, Filter, ChevronDown, Check } from 'lucide-react';
import { PRODUCTS } from '../../data/mockData';
import Breadcrumbs from '../../components/Breadcrumbs';

export default function Categories() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'Plants';

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

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 pt-8">


            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {/* Categories Navigation */}
                        <div className="space-y-1">
                            {filters.map((section, idx) => (
                                <div key={idx} className="pb-4 border-b border-gray-100 last:border-0 mb-4">
                                    <h3
                                        className={`font-bold mb-3 flex items-center justify-between cursor-pointer transition-colors ${selectedCategory === section.title ? 'text-[#2d5a3d]' : 'text-gray-900 hover:text-[#2d5a3d]'}`}
                                        onClick={() => handleCategoryClick(section.title)}
                                    >
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {section.items.map((item, i) => (
                                            <li key={i}>
                                                <button
                                                    onClick={() => handleCategoryClick(item)}
                                                    className={`flex items-center gap-2 text-sm transition-colors w-full text-left group ${selectedCategory === item ? 'text-[#2d5a3d] font-medium' : 'text-gray-600 hover:text-[#2d5a3d]'}`}
                                                >
                                                    <span className={`h-0.5 bg-[#2d5a3d] transition-all duration-300 ${selectedCategory === item ? 'w-2' : 'w-0 group-hover:w-2'}`}></span>
                                                    {item}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Additional Filters (checkbox style based on provided image Ref 2) */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900">Filters</h3>
                                <button className="text-xs text-[#2d5a3d] font-medium hover:underline">Clear all</button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center justify-between">
                                        Product Type
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </h4>
                                    <div className="space-y-2">
                                        {['Combo Packs (1)', 'Pebbles (4)', 'Sets (8)'].map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2 cursor-pointer group">
                                                <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center group-hover:border-[#2d5a3d] transition-colors bg-white">
                                                    {i === 0 && <Check size={10} className="text-[#2d5a3d]" />}
                                                </div>
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {PRODUCTS.map((p) => (
                                <Link
                                    key={p.id}
                                    to={`/user/product/${p.id}`}
                                    onClick={() => window.scrollTo(0, 0)}
                                    className="bg-white p-3 rounded-[24px] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer block text-left relative border border-gray-100 !no-underline !text-gray-900"
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
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Heart Logic
                                            }}
                                        >
                                            <Heart size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Image Area */}
                                    <div className="relative h-[150px] w-full mb-3 flex items-center justify-center">
                                        {p.new && (
                                            <span className="absolute top-0 right-0 px-2 py-1 text-[10px] font-bold text-white bg-green-500 rounded-full z-10 shadow-sm">
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
                                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded mb-2 inline-block">Save {p.discount}%</span>
                                        ) : <div className="h-5"></div>}

                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-xl font-bold text-[#b48a5f]">₹{typeof p.price === 'number' ? p.price.toFixed(0) : p.price}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{typeof p.price === 'number' ? (p.price * 1.2).toFixed(0) : p.price}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate font-serif tracking-tight group-hover:text-[#2d5a3d] transition-colors">{p.name}</h3>

                                        {/* Rating Section (Green Badge) */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-0.5 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < Math.floor(p.rating) ? "currentColor" : "none"} className={i >= Math.floor(p.rating) ? "text-gray-200" : ""} />
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-gray-500 font-medium">({p.reviews} reviews)</span>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            style={{ borderRadius: "8px" }}
                                            className="w-full py-2 bg-[#f0fdf4] hover:bg-[#2d5a3d] text-[#2d5a3d] hover:text-white text-xs font-bold rounded-xl transition-all border border-[#2d5a3d] flex items-center justify-center gap-2 mt-auto group/btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Add to cart logic
                                            }}
                                        >
                                            <ShoppingCart size={14} />
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
