import { useEffect, useMemo, useState } from 'react'
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Search as SearchIcon, MapPin, Sprout, ShoppingCart } from 'lucide-react'

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
      toast.success('Order placed successfully!')
    } catch (e) {
      toast.error('Failed to place order')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Plants</h1>
        <p className="text-slate-500 text-sm">Search nurseries and browse available plants.</p>
      </div>

      <div className="relative">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search by nursery name or city..."
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={18} className="text-emerald-600" /> Nurseries
            {coords && <span className="text-xs text-slate-400 font-normal">(sorted by distance)</span>}
          </h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {loading && !nurseries.length ? (
              <Card><p className="text-slate-500 text-center py-4">Loading nurseries...</p></Card>
            ) : filtered.length ? (
              filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => selectNursery(n)}
                  className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-md 
                    ${selected?.id === n.id ? 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/50' : 'bg-white border-slate-200 hover:border-emerald-200'}`}
                >
                  {n.imageUrl ? (
                    <img src={n.imageUrl} alt="nursery" className="h-16 w-16 rounded-lg object-cover shadow-sm" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Sprout size={24} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{n.name}</div>
                    <div className="text-sm text-slate-500">{n.city}</div>
                    {n.distance !== undefined && Number.isFinite(n.distance) && (
                      <div className="mt-1 text-xs text-emerald-600 font-medium">{n.distance.toFixed(1)} km away</div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <Card><p className="text-slate-500 text-center py-4">No nurseries found</p></Card>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Sprout size={18} className="text-emerald-600" />
            {selected ? `Items at ${selected.name}` : 'Select a nursery'}
          </h2>
          {selected && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {loading && !sugarcanes.length ? (
                <Card><p className="text-slate-500 text-center py-4">Loading items...</p></Card>
              ) : sugarcanes.length ? (
                sugarcanes.map((s) => (
                  <Card key={s.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt="item" className="h-14 w-14 rounded-lg object-cover shadow-sm" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <Sprout size={20} />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-800">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.variety}</div>
                        <div className="mt-1 text-sm font-bold text-emerald-700">₹{s.price?.toFixed?.(2) ?? s.price}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={s.qty}
                        onChange={(e) => setSugarcanes((prev) => prev.map((x) => x.id === s.id ? { ...x, qty: e.target.value } : x))}
                        className="w-16 rounded-lg border border-slate-200 px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <Button onClick={() => placeOrder(s)} size="sm">
                        <ShoppingCart size={16} className="mr-1" /> Order
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card><p className="text-slate-500 text-center py-4">No items available at this nursery</p></Card>
              )}
            </div>
          )}
          {!selected && (
            <Card className="flex flex-col items-center justify-center py-12 text-slate-400">
              <MapPin size={40} className="mb-2" />
              <p>Select a nursery to see available items</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
