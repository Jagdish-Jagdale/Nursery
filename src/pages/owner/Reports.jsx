import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, ShoppingCart } from 'lucide-react'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4']

export default function OwnerReports() {
  const { user } = useAuth()
  const [sugarcanes, setSugarcanes] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      const [sSnap, oSnap] = await Promise.all([
        getDocs(query(collection(db, 'sugarcanes'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'orders'), where('ownerId', '==', user.uid))),
      ])
      setSugarcanes(sSnap.docs.map((d) => d.data()))
      setOrders(oSnap.docs.map((d) => d.data()))
      setLoading(false)
    }
    load()
  }, [user])

  const stockByVariety = useMemo(() => {
    const map = new Map()
    sugarcanes.forEach((s) => {
      const key = s.variety || s.name
      map.set(key, (map.get(key) || 0) + (s.stock || 0))
    })
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [sugarcanes])

  const ordersByMonth = useMemo(() => {
    const map = new Map()
    orders.forEach((o) => {
      const d = o.createdAt?.toDate?.() || new Date()
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map.set(key, (map.get(key) || 0) + 1)
    })
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [orders])

  const totalStock = useMemo(() => stockByVariety.reduce((sum, item) => sum + item.value, 0), [stockByVariety])
  const totalOrders = useMemo(() => orders.length, [orders])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2 text-gray-900 font-extrabold">Reports</h3>
        <p className="text-base text-gray-600 mb-0 font-normal">
          Comprehensive insights into your inventory and order performance.
        </p>
        <hr className="mt-4 border-gray-100 opacity-50" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-2">Total Stock</p>
              <h3 className="text-4xl font-bold">{totalStock}</h3>
              <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                <span>All varieties combined</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Package size={32} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Total Orders</p>
              <h3 className="text-4xl font-bold">{totalOrders}</h3>
              <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                <span>Lifetime orders</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <ShoppingCart size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-full shadow-lg rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h5 className="font-bold text-gray-900 text-lg mb-1">Stock Distribution</h5>
            <p className="text-sm text-gray-500">Inventory breakdown by variety</p>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                />
                <Pie
                  data={stockByVariety}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {stockByVariety.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-full shadow-lg rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h5 className="font-bold text-gray-900 text-lg mb-1">Orders Timeline</h5>
            <p className="text-sm text-gray-500">Monthly order volume</p>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tickLine={false}
                  axisLine={false}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
