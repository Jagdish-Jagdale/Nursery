import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import Card from '../../components/common/Card'
import { Trees, Sprout, ShoppingBag, TrendingUp, Users } from 'lucide-react'
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

export default function AdminOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ nurseries: 0, sugarcanes: 0, orders: 0 })

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Nurseries"
          value={stats.nurseries}
          icon={<Trees size={24} className="text-emerald-600" />}
          trend="+12%"
        />
        <StatsCard
          title="Inventory Items"
          value={stats.sugarcanes}
          icon={<Sprout size={24} className="text-emerald-600" />}
          trend="+5%"
        />
        <StatsCard
          title="Active Orders"
          value={stats.orders}
          icon={<ShoppingBag size={24} className="text-emerald-600" />}
          trend="+18%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Sales Trends">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Stock Distribution">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon, trend }) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
        <p className="mt-2 flex items-center text-sm text-emerald-600 font-medium">
          <TrendingUp size={16} className="mr-1" />
          {trend}
          <span className="ml-1 text-slate-400 font-normal">from last month</span>
        </p>
      </div>
      <div className="rounded-xl bg-emerald-50 p-3">
        {icon}
      </div>
    </Card>
  )
}
