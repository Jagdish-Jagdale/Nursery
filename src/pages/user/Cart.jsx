import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { PRODUCTS } from '../../data/mockData'

export default function Cart() {
    // Mock cart items (subset of PRODUCTS)
    const [cartItems, setCartItems] = useState([
        { ...PRODUCTS[0], quantity: 2 },
        { ...PRODUCTS[1], quantity: 1 },
        { ...PRODUCTS[2], quantity: 3 },
        { ...PRODUCTS[3], quantity: 1 },
        { ...PRODUCTS[4], quantity: 2 },
        { ...PRODUCTS[5], quantity: 1 },
        { ...PRODUCTS[6], quantity: 1 }
    ])

    const updateQuantity = (id, change) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        )
    }

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 500 ? 0 : 40
    const tax = subtotal * 0.05
    const total = subtotal + shipping + tax

    if (cartItems.length === 0) {
        return (
            <div className="w-full min-h-screen bg-[#f8f9fa] flex items-center justify-center px-6" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                <div className="text-center max-w-md">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/user"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5a3d] text-white rounded-lg font-medium hover:bg-[#234830] transition-all !no-underline"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full bg-[#f8f9fa] pt-5 pb-5 px-6 sm:px-8 lg:px-12" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>



            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 font-serif">Shopping Cart</h1>
                <p className="text-gray-500 text-xs mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cart Items - Left Column */}
                <div className="lg:col-span-2">
                    <div className="space-y-2 max-h-[570px] overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-3 border border-gray-100 hover:shadow-sm transition-shadow">
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-lg text-gray-900 truncate font-serif">{item.name}</h4>
                                        <p className="text-[10px] text-gray-500 mb-1">Indoor Plant</p>
                                        <p className="text-xs text-gray-500 mb-1">
                                            {item.inStock ? (
                                                <span className="text-green-600">In Stock</span>
                                            ) : (
                                                <span className="text-red-500">Out of Stock</span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold text-[#2d5a3d]">₹{item.price}</span>
                                            <span className="text-xs text-gray-400">per item</span>
                                        </div>
                                    </div>

                                    {/* Quantity Controls + Remove */}
                                    <div className="flex flex-col items-end gap-2">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-gray-300 rounded-lg h-7">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors rounded-l-lg border-r border-gray-300"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-xs text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-7 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors rounded-r-lg border-l border-gray-300"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                                            title="Remove item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary - Right Column */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 font-serif">Order Summary</h2>

                        <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-gray-900">
                                    {shipping === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `₹${shipping}`
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (5%)</span>
                                <span className="font-medium text-gray-900">₹{tax.toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-[#2d5a3d]">₹{total.toFixed(0)}</span>
                        </div>

                        {shipping > 0 && (
                            <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                                Add ₹{(500 - subtotal).toFixed(0)} more to get <strong className="text-green-600">FREE shipping</strong>
                            </p>
                        )}

                        <button
                            style={{ borderRadius: "10px" }}
                            className="w-full bg-[#2d5a3d] text-white h-11  font-semibold text-sm hover:bg-[#234830] transition-all shadow-md shadow-green-900/10 active:scale-[0.99] mb-3">
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/user"
                            className="block text-center text-sm text-gray-600 hover:text-[#2d5a3d] transition-colors !no-underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
