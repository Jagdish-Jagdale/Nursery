import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid))
        const snap = await getDocs(q)
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Purchase History</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Nursery</th>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Variety</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={7}>Loading...</td></tr>
            ) : orders.length ? (
              orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-2">{o.createdAt?.toDate?.().toLocaleString?.() || '-'}</td>
                  <td className="px-4 py-2">{o.nurseryName || '-'}</td>
                  <td className="px-4 py-2">{o.sugarcaneName || '-'}</td>
                  <td className="px-4 py-2">{o.variety || '-'}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">₹{o.total?.toFixed?.(2) ?? o.total}</td>
                  <td className="px-4 py-2">{o.status || '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td className="px-4 py-3" colSpan={7}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
