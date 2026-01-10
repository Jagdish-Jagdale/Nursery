import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis, Cell } from 'recharts'

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4']

export default function Reports() {
  const { user } = useAuth()
  const [sugarcanes, setSugarcanes] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [sSnap, oSnap] = await Promise.all([
        getDocs(query(collection(db, 'sugarcanes'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'orders'), where('ownerId', '==', user.uid))),
      ])
      setSugarcanes(sSnap.docs.map((d) => d.data()))
      setOrders(oSnap.docs.map((d) => d.data()))
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Stock by Variety</h2>
          <PieChart width={400} height={280}>
            <Tooltip />
            <Legend />
            <Pie data={stockByVariety} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {stockByVariety.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Orders per Month</h2>
          <BarChart width={450} height={280} data={ordersByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </div>
      </div>
    </div>
  )
}
