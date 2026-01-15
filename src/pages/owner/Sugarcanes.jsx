import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import SugarcaneForm from '../../components/forms/SugarcaneForm'
import Table, { TableCell, TableRow } from '../../components/common/Table'
import Button from '../../components/common/Button'
import { Plus, Pencil, Trash2, Sprout } from 'lucide-react'

export default function Sugarcanes() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [nurseries, setNurseries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    if (!user) return
    setLoading(true)
    try {
      const [nSnap, sSnap] = await Promise.all([
        getDocs(query(collection(db, 'nurseries'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'sugarcanes'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))),
      ])
      setNurseries(nSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setItems(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (e) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const save = async (data, file) => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'sugarcanes', editing.id), { ...data })
        if (file) {
          const storageRef = ref(storage, `sugarcanes/${editing.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'sugarcanes', editing.id), { imageUrl: url })
        }
        toast.success('Updated successfully')
      } else {
        const docRef = await addDoc(collection(db, 'sugarcanes'), { ...data, ownerId: user.uid, createdAt: serverTimestamp() })
        if (file) {
          const storageRef = ref(storage, `sugarcanes/${docRef.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'sugarcanes', docRef.id), { imageUrl: url })
        }
        toast.success('Created successfully')
      }
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (e) {
      toast.error('Save failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await deleteDoc(doc(db, 'sugarcanes', id))
      toast.success('Deleted successfully')
      await load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="w-full h-full bg-white py-2 px-4 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl mb-2 text-gray-900 font-extrabold">Inventory Items</h3>
          <p className="text-base text-gray-600 mb-0 font-normal">
            Manage your sugarcane varieties and stock.
          </p>
          <hr className="mt-4 border-gray-100 opacity-50" />
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus size={18} className="mr-2" /> Add Item
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">{editing ? 'Edit Item' : 'New Item'}</h2>
          <SugarcaneForm value={editing} nurseries={nurseries} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table headers={['Image', 'Name', 'Variety', 'Price', 'Stock', 'Nursery', 'Actions']}>
          {loading ? (
            <TableRow><TableCell className="text-center py-8" colSpan={7}>Loading inventory...</TableCell></TableRow>
          ) : items.length ? (
            items.map((n) => (
              <TableRow key={n.id}>
                <TableCell>
                  {n.imageUrl ? (
                    <img src={n.imageUrl} alt="item" className="h-12 w-12 rounded-lg object-cover border border-slate-100 shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Sprout size={20} />
                    </div>
                  )}
                </TableCell>
                <TableCell><span className="font-medium text-slate-700">{n.name}</span></TableCell>
                <TableCell>{n.variety}</TableCell>
                <TableCell className="font-semibold text-emerald-700">₹{n.price?.toFixed?.(2) ?? n.price}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${n.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {n.stock}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-500">{nurseries.find((x) => x.id === n.nurseryId)?.name || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => { setEditing(n); setShowForm(true) }}>
                      <Pencil size={14} className="mr-1" /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => remove(n.id)}>
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell className="text-center py-8 text-slate-400" colSpan={7}>No items found.</TableCell></TableRow>
          )}
        </Table>
      </div>
    </div>
  )
}
