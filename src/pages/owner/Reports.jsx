import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Tooltip, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4']

export default function OwnerReports() {
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
    <div className="w-full h-full bg-white py-2 px-4 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl mb-2 text-gray-900 font-extrabold">Reports</h3>
        <p className="text-base text-gray-600 mb-0 font-normal">
          View your inventory and order reports.
        </p>
        <hr className="mt-4 border-gray-100 opacity-50" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-full shadow-sm rounded-2xl bg-white border border-gray-200 p-5">
          <h5 className="mb-4 font-bold text-gray-900 text-base">Stock by Variety</h5>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={stockByVariety} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {stockByVariety.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-full shadow-sm rounded-2xl bg-white border border-gray-200 p-5">
          <h5 className="mb-4 font-bold text-gray-900 text-base">Orders per Month</h5>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
