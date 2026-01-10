import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../lib/firebase'
import { ShoppingBag, MapPin, Leaf, ArrowRight, Package, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UserOverview() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [nearest, setNearest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid)))
      setOrders(snap.docs.map((d) => d.data()))
      setLoading(false)
    }
    load()
  }, [user])

  useEffect(() => {
    const loadNearest = async () => {
      try {
        const nSnap = await getDocs(collection(db, 'nurseries'))
        const nurseries = nSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        if (!('geolocation' in navigator)) return
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords
          const withDist = nurseries
            .map((n) => ({ ...n, distance: n.lat && n.lng ? haversine(latitude, longitude, n.lat, n.lng) : Infinity }))
            .filter((n) => Number.isFinite(n.distance))
            .sort((a, b) => a.distance - b.distance)
          setNearest(withDist[0] || null)
        })
      } catch { }
    }
    loadNearest()
  }, [])

  const totalOrders = orders.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome Back! 🌱</h1>
        <p className="mt-2 text-emerald-100">Here's an overview of your nursery activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={ShoppingBag}
          label="Your Orders"
          value={loading ? '...' : totalOrders}
          subtitle="Total purchases"
          color="emerald"
        />
        <StatCard
          icon={MapPin}
          label="Nearest Nursery"
          value={nearest ? nearest.name : 'Detecting...'}
          subtitle={nearest ? `${nearest.distance.toFixed(1)} km away` : 'Getting location...'}
          color="blue"
        />
        <StatCard
          icon={Leaf}
          label="Explore"
          value="Find Plants"
          subtitle="Browse our collection"
          color="amber"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            to="/user/search"
            icon={Search}
            title="Find Nurseries"
            description="Locate nurseries near you"
            color="emerald"
          />
          <QuickAction
            to="/user/orders"
            icon={Package}
            title="View Orders"
            description="Track your purchases"
            color="blue"
          />
          <QuickAction
            to="/user/search"
            icon={Leaf}
            title="Browse Plants"
            description="Explore available plants"
            color="green"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, title, description, color }) {
  const bgColors = {
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
  }

  return (
    <Link
      to={to}
      className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${bgColors[color]} flex items-center justify-center transition-colors`}>
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
