import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'
import { PRODUCTS } from '../data/mockData'

export default function Breadcrumbs() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')

    // Split path and remove empty strings
    // e.g. "/user/product/123" -> ["user", "product", "123"]
    const pathSegments = location.pathname.split('/').filter(Boolean)

    return (
        <div className="w-full bg-white border-b border-gray-200">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-3">
                <nav className="flex items-center text-sm text-gray-500">
                    <Link
                        to="/user"
                        className="flex items-center gap-1 font-medium transition-all hover:opacity-80"
                        style={{ color: '#2d5a3d', textDecoration: 'none' }}
                    >
                        <Home size={16} />
                        <span>Home</span>
                    </Link>

                    {pathSegments.map((segment, index) => {
                        // Skip 'user' segment from display
                        if (segment === 'user') return null

                        let name = segment
                        // Default path
                        let to = `/${pathSegments.slice(0, index + 1).join('/')}`
                        let isClickable = true

                        // Handle "product" segment -> "Plants"
                        if (segment === 'product') {
                            name = "Plants"
                            // Redirect 'Plants' breadcrumb to search/catalog
                            to = "/user/search"
                        }

                        // Handle "search" segment -> "Categories"
                        if (segment === 'search') {
                            const showCategory = categoryParam && categoryParam !== 'All Plants';
                            return (
                                <div key={to + index} className="flex items-center">
                                    <ChevronRight size={14} className="mx-2 text-gray-400" />

                                    {/* Static Categories Text */}
                                    <span
                                        className="font-medium"
                                        style={{ color: '#2d5a3d', cursor: 'default' }} // Matches Home color but read-only
                                    >
                                        Categories
                                    </span>

                                    {showCategory && (
                                        <>
                                            <ChevronRight size={14} className="mx-2 text-gray-400" />
                                            <span className="font-semibold text-gray-900 line-clamp-1 max-w-[300px]">
                                                {categoryParam}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )
                        }

                        // Handle Product ID (if previous segment was 'product')
                        if (pathSegments[index - 1] === 'product') {
                            const product = PRODUCTS.find(p => p.id === parseInt(segment) || p.id === segment)
                            if (product) {
                                name = product.name
                            }
                            // The last item (current page) is usually not clickable
                            isClickable = false
                        }

                        // Format other names if not handled above
                        if (name === segment && pathSegments[index - 1] !== 'product' && segment !== 'product') {
                            name = segment
                                .replace(/-/g, ' ')
                                .replace(/%20/g, ' ')
                                .replace(/^\w/, c => c.toUpperCase())
                        }

                        const isLast = index === pathSegments.length - 1

                        return (
                            <div key={to + index} className="flex items-center">
                                <ChevronRight size={14} className="mx-2 text-gray-400" />
                                {isLast || !isClickable ? (
                                    <span className="font-semibold text-gray-900 line-clamp-1 max-w-[300px]">
                                        {name}
                                    </span>
                                ) : (
                                    <Link
                                        to={to}
                                        className="font-medium transition-all hover:text-[#2d5a3d]"
                                        style={{ color: '#6b7280', textDecoration: 'none' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#2d5a3d'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                                    >
                                        {name}
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
