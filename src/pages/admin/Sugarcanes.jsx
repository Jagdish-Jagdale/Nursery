import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import SugarcaneForm from '../../components/forms/SugarcaneForm'

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
        toast.success('Updated')
      } else {
        const docRef = await addDoc(collection(db, 'sugarcanes'), { ...data, ownerId: user.uid, createdAt: serverTimestamp() })
        if (file) {
          const storageRef = ref(storage, `sugarcanes/${docRef.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'sugarcanes', docRef.id), { imageUrl: url })
        }
        toast.success('Created')
      }
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (e) {
      toast.error('Save failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await deleteDoc(doc(db, 'sugarcanes', id))
      toast.success('Deleted')
      await load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sugarcane Items</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="rounded-md bg-indigo-600 px-4 py-2 text-white">Add Item</button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 font-medium">{editing ? 'Edit Item' : 'New Item'}</h2>
          <SugarcaneForm value={editing} nurseries={nurseries} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Variety</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Nursery</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={7}>Loading...</td></tr>
            ) : items.length ? (
              items.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-2">{n.imageUrl ? <img src={n.imageUrl} alt="item" className="h-12 w-12 rounded object-cover" /> : '-'}</td>
                  <td className="px-4 py-2">{n.name}</td>
                  <td className="px-4 py-2">{n.variety}</td>
                  <td className="px-4 py-2">₹{n.price?.toFixed?.(2) ?? n.price}</td>
                  <td className="px-4 py-2">{n.stock}</td>
                  <td className="px-4 py-2">{nurseries.find((x) => x.id === n.nurseryId)?.name || '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => { setEditing(n); setShowForm(true) }} className="rounded-md border px-3 py-1">Edit</button>
                    <button onClick={() => remove(n.id)} className="rounded-md border px-3 py-1">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="px-4 py-3" colSpan={7}>No items</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
