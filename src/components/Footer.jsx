import React from 'react'

export default function Footer() {
    return (
        <footer className="w-full bg-[#2d5a3d] text-white block mt-8">
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
    )
}
