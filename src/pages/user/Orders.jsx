import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, ArrowLeft, Search, Filter, Package, ChevronRight, RotateCcw } from 'lucide-react'
import { PRODUCTS } from '../../data/mockData'

// Mock orders data
const MOCK_ORDERS = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-20',
        status: 'delivered',
        deliveryDate: 'Oct 30, 2025',
        items: [
            { ...PRODUCTS[0], quantity: 2, variant: 'Red' }
        ]
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-18',
        status: 'cancelled',
        deliveryDate: 'Sep 26, 2025',
        items: [
            { ...PRODUCTS[3], quantity: 1, variant: 'Medium' }
        ]
    },
    {
        id: 'ORD-2024-003',
        date: '2024-01-22',
        status: 'delivered',
        deliveryDate: 'Feb 16, 2025',
        items: [
            { ...PRODUCTS[2], quantity: 3, variant: 'Green' }
        ]
    },
    {
        id: 'ORD-2024-004',
        date: '2024-01-15',
        status: 'delivered',
        deliveryDate: 'Feb 12, 2025',
        items: [
            { ...PRODUCTS[5], quantity: 1, variant: 'Potted' }
        ]
    },
    {
        id: 'ORD-2024-005',
        date: '2024-01-10',
        status: 'delivered',
        deliveryDate: 'Feb 09, 2025',
        items: [
            { ...PRODUCTS[6], quantity: 2, variant: 'Small' }
        ]
    }
]

export default function Orders() {
    const [orders] = useState(MOCK_ORDERS)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const getStatusConfig = (status) => {
        switch (status) {
            case 'delivered':
                return { label: 'Delivered', color: 'text-green-700', dot: 'bg-green-500', bg: 'bg-green-50' }
            case 'cancelled':
                return { label: 'Cancelled', color: 'text-red-600', dot: 'bg-red-500', bg: 'bg-red-50' }
            case 'shipped':
                return { label: 'Shipped', color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50' }
            default:
                return { label: 'Processing', color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' }
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.items[0].name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] py-4 px-4 sm:px-6 font-['Inter',sans-serif]">

            {/* Back Button */}
            <Link
                to="/user"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2d5a3d] mb-4 text-sm font-medium !no-underline transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
                <p className="text-sm text-gray-500">Track and manage your plant orders</p>
            </div>

            {/* Search and Filter - Compact */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search your orders here"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative sm:w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#2d5a3d] focus:border-transparent appearance-none bg-white cursor-pointer"
                        >
                            <option value="all">All Orders</option>
                            <option value="delivered">Delivered</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <ShoppingBag size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">No orders found</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchQuery ? 'Try adjusting your search' : 'Start shopping to see your orders here'}
                        </p>
                        <Link
                            to="/user"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a3d] text-white rounded-md text-sm font-medium hover:bg-[#234830] !no-underline transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div>
                        {filteredOrders.map((order, index) => {
                            const item = order.items[0]
                            const statusConfig = getStatusConfig(order.status)

                            return (
                                <div
                                    key={order.id}
                                    className={`px-5 py-4 hover:bg-gray-50 transition-colors ${index !== filteredOrders.length - 1 ? 'border-b border-gray-100' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-[#1a4d8f] hover:underline cursor-pointer leading-tight">
                                                {item.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Variant: {item.variant}
                                            </p>
                                        </div>

                                        {/* Price */}
                                        <div className="w-16 text-left flex-shrink-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Status & Date */}
                                        <div className="w-52 flex-shrink-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                                                <span className={`text-sm font-medium ${statusConfig.color}`}>
                                                    {statusConfig.label} on {order.deliveryDate}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 ml-3.5">
                                                {order.status === 'delivered'
                                                    ? 'Your item has been delivered'
                                                    : order.status === 'cancelled'
                                                        ? 'Your order was cancelled as per your request'
                                                        : 'Your order is on the way'}
                                            </p>
                                            {order.status === 'delivered' && (
                                                <button className="inline-flex items-center gap-1 text-xs text-[#1a4d8f] hover:underline mt-1.5 ml-3.5 font-medium">
                                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                                    Rate & Review Product
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Results Counter */}
            {filteredOrders.length > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                    Showing {filteredOrders.length} of {orders.length} orders
                </p>
            )}
        </div>
    )
}
