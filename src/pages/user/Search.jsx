import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

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

export default function Search() {
  const { user } = useAuth()
  const [qText, setQText] = useState('')
  const [nurseries, setNurseries] = useState([])
  const [coords, setCoords] = useState(null)
  const [selected, setSelected] = useState(null)
  const [sugarcanes, setSugarcanes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'nurseries'))
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setNurseries(list)
      } catch (e) {
        toast.error('Failed to load nurseries')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!('geolocation' in navigator)) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords(null)
    )
  }, [])

  const filtered = useMemo(() => {
    let list = nurseries
    if (qText.trim()) {
      const q = qText.trim().toLowerCase()
      list = list.filter((n) =>
        (n.name || '').toLowerCase().includes(q) || (n.city || '').toLowerCase().includes(q)
      )
    }
    if (coords) {
      list = list
        .map((n) => ({
          ...n,
          distance: n.lat && n.lng ? haversine(coords.lat, coords.lng, n.lat, n.lng) : Infinity,
        }))
        .sort((a, b) => a.distance - b.distance)
    }
    return list
  }, [nurseries, qText, coords])

  const selectNursery = async (n) => {
    setSelected(n)
    setLoading(true)
    try {
      const sSnap = await getDocs(
        query(collection(db, 'sugarcanes'), where('nurseryId', '==', n.id), orderBy('createdAt', 'desc'))
      )
      setSugarcanes(sSnap.docs.map((d) => ({ id: d.id, ...d.data(), qty: 1 })))
    } catch (e) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async (item) => {
    if (!user) {
      toast.error('Please sign in to place orders')
      return
    }
    const qty = Number(item.qty || 1)
    if (!qty || qty <= 0) return
    try {
      // fetch fresh price/owner if needed
      const sDoc = await getDoc(doc(db, 'sugarcanes', item.id))
      const sData = sDoc.exists() ? sDoc.data() : item
      const total = (sData.price || 0) * qty
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        ownerId: sData.ownerId || selected?.ownerId || null,
        sugarcaneId: item.id,
        sugarcaneName: sData.name,
        variety: sData.variety || '',
        nurseryId: selected?.id || sData.nurseryId,
        nurseryName: selected?.name || '',
        price: sData.price || 0,
        quantity: qty,
        total,
        status: 'placed',
        createdAt: serverTimestamp(),
      })
      toast.success('Order placed')
    } catch (e) {
      toast.error('Failed to place order')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Find Nurseries</h1>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          placeholder="Search by name or city"
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-medium">Nurseries {coords && <span className="text-slate-500">(sorted by distance)</span>}</h2>
          <div className="grid grid-cols-1 gap-3">
            {loading && !nurseries.length ? (
              <div className="rounded-md border p-4">Loading...</div>
            ) : filtered.length ? (
              filtered.map((n) => (
                <button key={n.id} onClick={() => selectNursery(n)} className={`flex items-center justify-between rounded-md border p-3 text-left hover:bg-slate-100 ${selected?.id === n.id ? 'ring-2 ring-indigo-500' : ''}`}>
                  <div>
                    <div className="font-medium">{n.name}</div>
                    <div className="text-sm text-slate-500">{n.city}{n.distance !== undefined && Number.isFinite(n.distance) ? ` • ${n.distance.toFixed(1)} km` : ''}</div>
                  </div>
                  {n.imageUrl && <img src={n.imageUrl} alt="nursery" className="h-12 w-12 rounded object-cover" />}
                </button>
              ))
            ) : (
              <div className="rounded-md border p-4">No nurseries found</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-medium">{selected ? `Items at ${selected.name}` : 'Select a nursery'}</h2>
          {selected && (
            <div className="grid grid-cols-1 gap-3">
              {loading && !sugarcanes.length ? (
                <div className="rounded-md border p-4">Loading...</div>
              ) : sugarcanes.length ? (
                sugarcanes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      {s.imageUrl && <img src={s.imageUrl} alt="item" className="h-12 w-12 rounded object-cover" />}
                      <div>
                        <div className="font-medium">{s.name} <span className="text-sm text-slate-500">{s.variety}</span></div>
                        <div className="text-sm text-slate-500">₹{s.price?.toFixed?.(2) ?? s.price} • Stock {s.stock}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} value={s.qty}
                        onChange={(e) => setSugarcanes((prev) => prev.map((x) => x.id === s.id ? { ...x, qty: e.target.value } : x))}
                        className="w-20 rounded-md border px-2 py-1 text-right" />
                      <button onClick={() => placeOrder(s)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-white">Order</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-md border p-4">No items available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
