import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/common/Card'
import { Trees, Sprout, ShoppingBag, TrendingUp, TrendingDown, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const data = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
]

const pieData = [
  { name: 'Sugarcane', value: 400 },
  { name: 'Mango', value: 300 },
  { name: 'Other', value: 300 },
]

const COLORS = ['#10b981', '#f59e0b', '#64748b']

export default function OwnerOverview() {
  const { user } = useAuth()
  const [ownerName, setOwnerName] = useState('')
  const [stats, setStats] = useState({ nurseries: 0, sugarcanes: 0, orders: 0 })

  // Fetch owner name in real-time
  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(doc(db, "owners", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setOwnerName(docSnap.data().ownerName || "Owner")
      }
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      // In a real app we'd fetch this from a summary endpoint or perform aggregated queries
      const [nSnap, sSnap, oSnap] = await Promise.all([
        getDocs(query(collection(db, 'nurseries'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'sugarcanes'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'orders'), where('ownerId', '==', user.uid))),
      ])
      setStats({ nurseries: nSnap.size, sugarcanes: sSnap.size, orders: oSnap.size })
    }
    load()
  }, [user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white py-2 px-4 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl mb-2 text-gray-900 font-extrabold">{getGreeting()}, {ownerName}! 👋</h3>
        <p className="text-base text-gray-600 mb-0 font-normal">
          Here's a comprehensive overview of your nursery business.
        </p>
        <hr className="mt-4 border-gray-100 opacity-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatsCard
          title="Total Nurseries"
          value={stats.nurseries}
          icon={<Trees size={24} className="text-white" />}
          trend="+12%"
          trendUp={true}
          gradient="from-emerald-500 to-green-600"
        />
        <StatsCard
          title="Inventory Items"
          value={stats.sugarcanes}
          icon={<Sprout size={24} className="text-white" />}
          trend="+5%"
          trendUp={true}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Active Orders"
          value={stats.orders}
          icon={<ShoppingBag size={24} className="text-white" />}
          trend="+18%"
          trendUp={true}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full shadow-lg rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h5 className="font-bold text-gray-900 text-lg mb-1">Sales Performance</h5>
            <p className="text-sm text-gray-500">Monthly sales trend analysis</p>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#1f2937' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-full shadow-lg rounded-2xl bg-white border border-gray-200 p-6 hover:shadow-xl transition-shadow">
          <div className="mb-4">
            <h5 className="font-bold text-gray-900 text-lg mb-1">Stock Distribution</h5>
            <p className="text-sm text-gray-500">Inventory breakdown by category</p>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon, trend, trendUp, gradient }) {
  return (
    <div className={`relative overflow-hidden h-full shadow-lg rounded-2xl bg-gradient-to-br ${gradient} p-6 hover:shadow-xl transition-all transform hover:scale-[1.02] group cursor-pointer`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
            <h3 className="text-4xl font-bold text-white mb-3">{value}</h3>
            <div className="flex items-center gap-1.5">
              {trendUp ? (
                <ArrowUpRight size={18} className="text-white/90" />
              ) : (
                <ArrowDownRight size={18} className="text-white/90" />
              )}
              <span className="text-white/90 text-sm font-medium">{trend}</span>
              <span className="text-white/70 text-xs ml-1">from last month</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
