import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import Table, { TableCell, TableRow } from '../../components/common/Table'
import { ShoppingBag } from 'lucide-react'

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

  const statusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-amber-100 text-amber-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Purchase History</h1>
        <p className="text-slate-500 text-sm">View all your past orders.</p>
      </div>

      <Table headers={['Date', 'Nursery', 'Item', 'Variety', 'Qty', 'Total', 'Status']}>
        {loading ? (
          <TableRow><TableCell className="text-center py-8" colSpan={7}>Loading orders...</TableCell></TableRow>
        ) : orders.length ? (
          orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="text-xs text-slate-500">{o.createdAt?.toDate?.().toLocaleDateString?.() || '-'}</TableCell>
              <TableCell><span className="font-medium text-slate-700">{o.nurseryName || '-'}</span></TableCell>
              <TableCell>{o.sugarcaneName || '-'}</TableCell>
              <TableCell className="text-slate-500">{o.variety || '-'}</TableCell>
              <TableCell>{o.quantity}</TableCell>
              <TableCell className="font-semibold text-emerald-700">₹{o.total?.toFixed?.(2) ?? o.total}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(o.status)}`}>
                  {o.status || '-'}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-center py-12" colSpan={7}>
              <div className="flex flex-col items-center justify-center text-slate-400">
                <ShoppingBag size={40} className="mb-2" />
                <p className="font-medium">No orders yet</p>
                <p className="text-xs">Start shopping to see your orders here.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  )
}
