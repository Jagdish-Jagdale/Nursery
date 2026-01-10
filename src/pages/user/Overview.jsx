import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../lib/firebase'

export default function UserOverview() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [nearest, setNearest] = useState(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const snap = await getDocs(query(collection(db, 'orders'), where('userId', '==', user.uid)))
      setOrders(snap.docs.map((d) => d.data()))
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
      } catch {}
    }
    loadNearest()
  }, [])

  const totalOrders = orders.length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Your Orders" value={totalOrders} />
        <Card title="Nearest Nursery" value={nearest ? `${nearest.name} (${nearest.distance.toFixed(1)} km)` : 'Detecting...'} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
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
