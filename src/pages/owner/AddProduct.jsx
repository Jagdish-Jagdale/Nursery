import { useState } from "react";
import { Search, Filter, Package, X, Upload } from "lucide-react";

// Dummy product data
const DUMMY_PRODUCTS = [
    { id: 1, name: "Red Rose Plant", category: "Flowering Plants", quantity: 45, price: 250, status: "In Stock", image: "https://via.placeholder.com/100/ff6b6b/ffffff?text=🌹" },
    { id: 2, name: "Tulip Bulbs", category: "Flowering Plants", quantity: 30, price: 150, status: "In Stock", image: "https://via.placeholder.com/100/ee5a6f/ffffff?text=🌷" },
    { id: 3, name: "Sunflower Seeds", category: "Seeds", quantity: 120, price: 50, status: "In Stock", image: "https://via.placeholder.com/100/ffd93d/ffffff?text=🌻" },
    { id: 4, name: "Orchid Plant", category: "Indoor Plants", quantity: 8, price: 800, status: "Low Stock", image: "https://via.placeholder.com/100/c44569/ffffff?text=🌺" },
    { id: 5, name: "Monstera Deliciosa", category: "Indoor Plants", quantity: 25, price: 450, status: "In Stock", image: "https://via.placeholder.com/100/6bcf7f/ffffff?text=🌿" },
    { id: 6, name: "Snake Plant", category: "Indoor Plants", quantity: 50, price: 200, status: "In Stock", image: "https://via.placeholder.com/100/4caf50/ffffff?text=🪴" },
    { id: 7, name: "Peace Lily", category: "Indoor Plants", quantity: 35, price: 300, status: "In Stock", image: "https://via.placeholder.com/100/ffb6c1/ffffff?text=🌸" },
    { id: 8, name: "Aloe Vera", category: "Succulents", quantity: 60, price: 100, status: "In Stock", image: "https://via.placeholder.com/100/90ee90/ffffff?text=🌵" },
    { id: 9, name: "Pothos Plant", category: "Indoor Plants", quantity: 5, price: 180, status: "Low Stock", image: "https://via.placeholder.com/100/8bc34a/ffffff?text=🍃" },
    { id: 10, name: "Lavender Seeds", category: "Seeds", quantity: 80, price: 75, status: "In Stock", image: "https://via.placeholder.com/100/9575cd/ffffff?text=🌾" },
];

export default function AddProduct() {
    const [products, setProducts] = useState(DUMMY_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const getStatusBadge = (status) => {
        if (status === "Low Stock") {
            return <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Low Stock</span>;
        }
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">In Stock</span>;
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 font-['Inter',sans-serif]">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl mb-2 text-gray-900 font-extrabold">Products</h3>
                <p className="text-base text-gray-600 mb-0 font-normal">
                    Manage your plant inventory and product listings.
                </p>
            </div>

            <hr className="mb-6 border-gray-200" />

            {/* Search and Filter Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-semibold text-gray-900">Search and Filters</h5>
                    <button
                        onClick={() => setShowAddModal(true)}
                        style={{ borderRadius: "12px" }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md text-sm"
                    >
                        + Add Product
                    </button>
                </div>
                <hr className="mb-6 border-gray-200" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Search Products
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by product name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Filter by Category
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Categories</option>
                                <option value="Flowering Plants">Flowering Plants</option>
                                <option value="Indoor Plants">Indoor Plants</option>
                                <option value="Succulents">Succulents</option>
                                <option value="Seeds">Seeds</option>
                            </select>
                        </div>
                    </div>

                    {/* Stock Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Stock Status
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="In Stock">In Stock</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Price Range
                        </label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                            >
                                <option value="all">Any Price</option>
                                <option value="low">Low (&lt; ₹100)</option>
                                <option value="medium">Medium (₹100 - ₹500)</option>
                                <option value="high">High (&gt; ₹500)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Package size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
                            <p className="text-gray-500">
                                {searchQuery || categoryFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "You haven't added any products yet"}
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
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Product Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        style={{ borderBottom: '1px solid #dae2eeff' }}
                                        className="bg-white transition-colors cursor-pointer hover:!bg-blue-50"
                                    >
                                        <td className="px-6 py-2.5 whitespace-nowrap text-center">
                                            <span className="text-sm text-gray-900">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className="text-sm text-gray-900">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                ₹{product.price}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap">
                                            {getStatusBadge(product.status)}
                                        </td>
                                        <td className="px-6 py-2.5 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleView(product)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Results Counter */}
            {filteredProducts.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                </div>
            )}

            {/* Product Details Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Product Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Product Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Product Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Category</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Quantity Available</p>
                                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.quantity} units</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Price</p>
                                        <p className="text-lg font-bold text-green-600">₹{selectedProduct.price}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Status</p>
                                        {getStatusBadge(selectedProduct.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
