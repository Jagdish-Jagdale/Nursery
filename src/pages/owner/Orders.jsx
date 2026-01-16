import { useState } from "react";
import { Search, Filter, ShoppingCart, X } from "lucide-react";

// Dummy data
const DUMMY_ORDERS = [
    { id: 1, plantName: "Red Rose Plant", quantity: 5, price: 250, customer: "John Doe", phone: "+91 9876543210", address: "123 Garden Street, Mumbai", status: "In Progress" },
    { id: 2, plantName: "Tulip Bulbs", quantity: 12, price: 150, customer: "Jane Smith", phone: "+91 9876543211", address: "456 Flora Avenue, Delhi", status: "In Progress" },
    { id: 3, plantName: "Sunflower Seeds", quantity: 20, price: 50, customer: "Bob Johnson", phone: "+91 9876543212", address: "789 Plant Road, Bangalore", status: "Delivered" },
    { id: 4, plantName: "Orchid Plant", quantity: 3, price: 800, customer: "Alice Brown", phone: "+91 9876543213", address: "321 Bloom Lane, Pune", status: "In Progress" },
    { id: 5, plantName: "Monstera Deliciosa", quantity: 8, price: 450, customer: "Charlie Wilson", phone: "+91 9876543214", address: "654 Green Park, Chennai", status: "Delivered" },
    { id: 6, plantName: "Snake Plant", quantity: 15, price: 200, customer: "Diana Prince", phone: "+91 9876543215", address: "987 Nature Way, Hyderabad", status: "In Progress" },
    { id: 7, plantName: "Peace Lily", quantity: 10, price: 300, customer: "Eve Davis", phone: "+91 9876543216", address: "147 Leaf Street, Kolkata", status: "In Progress" },
    { id: 8, plantName: "Aloe Vera", quantity: 25, price: 100, customer: "Frank Miller", phone: "+91 9876543217", address: "258 Herb Avenue, Ahmedabad", status: "Delivered" },
    { id: 9, plantName: "Pothos Plant", quantity: 6, price: 180, customer: "Grace Lee", phone: "+91 9876543218", address: "369 Vine Road, Jaipur", status: "In Progress" },
    { id: 10, plantName: "Lavender Seeds", quantity: 30, price: 75, customer: "Henry Taylor", phone: "+91 9876543219", address: "741 Blossom Lane, Lucknow", status: "In Progress" },
];

export default function Orders() {
    const [orders, setOrders] = useState(DUMMY_ORDERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [amountFilter, setAmountFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Handle status change
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    // Filter orders based on search
    const filteredOrders = orders.filter(order =>
        order.plantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleView = (order) => {
        setSelectedOrder(order);
    };

    const handleDelete = (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            setOrders(orders.filter(order => order.id !== orderId));
        }
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 font-['Inter',sans-serif]">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl mb-2 text-gray-900 font-extrabold">Orders</h3>
                <p className="text-base text-gray-600 mb-0 font-normal">
                    Manage and track customer orders for your plants and crops.
                </p>
            </div>

            <hr className="mb-6 border-gray-200" />

            {/* Search and Filter Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h5 className="text-xs font-semibold text-gray-900 mb-2">Search and Filters</h5>
                <hr className="mb-6 border-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Orders
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by plant name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filter by Status
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                    {/* Date Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date Range
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>

                    {/* Amount Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Order Amount
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={amountFilter}
                                onChange={(e) => setAmountFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">Any Amount</option>
                                <option value="high">High (&gt; ₹500)</option>
                                <option value="low">Low (&lt; ₹500)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            < div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" >
                <div className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <ShoppingCart size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                            <p className="text-gray-500">
                                {searchQuery ? "Try adjusting your search" : "You haven't received any orders yet"}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Sr No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Plant Name
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredOrders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => handleView(order)}
                                        style={{ borderBottom: '1px solid #dae2eeff' }}
                                        className="bg-white transition-colors cursor-pointer hover:!bg-blue-50"
                                    >
                                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                                            <span className="text-sm text-gray-900">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className="text-sm font-medium text-gray-900">
                                                {order.plantName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                                            <span className="text-sm text-gray-900">
                                                {order.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div>
                                                <div className="text-sm text-gray-900 font-medium">
                                                    {order.customer}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {order.address}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                style={{ fontSize: '14px' }}
                                                className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="In Progress">In Progress</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancel">Cancel</option>
                                                <option value="Return">Return</option>
                                            </select>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div >

            {/* Results Counter */}
            {
                filteredOrders.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                )
            }

            {/* Order Details Modal */}
            {
                selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Order Info */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Order Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                            <p className="text-sm font-semibold text-gray-900">#{String(selectedOrder.id).padStart(4, '0')}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Plant Name</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.plantName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.quantity} units</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                                            <p className="text-sm font-semibold text-gray-900">₹{selectedOrder.price}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                            <p className="text-lg font-bold text-green-600">₹{selectedOrder.price * selectedOrder.quantity}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Customer Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.customer}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                                            <p className="text-sm font-semibold text-gray-900">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
