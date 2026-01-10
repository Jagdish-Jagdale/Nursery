import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ nurseries: 0, sugarcanes: 0, orders: 0 })

  useEffect(() => {
    if (!user) return
    const load = async () => {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Nurseries" value={stats.nurseries} />
        <Card title="Sugarcane Items" value={stats.sugarcanes} />
        <Card title="Orders" value={stats.orders} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
