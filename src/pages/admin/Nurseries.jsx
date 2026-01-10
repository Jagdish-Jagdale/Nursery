import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import NurseryForm from '../../components/forms/NurseryForm'

export default function Nurseries() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    if (!user) return
    setLoading(true)
    try {
      const q = query(collection(db, 'nurseries'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (e) {
      toast.error('Failed to load nurseries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user])

  const save = async (data, file) => {
    try {
      if (editing) {
        await updateDoc(doc(db, 'nurseries', editing.id), { ...data })
        if (file) {
          const storageRef = ref(storage, `nurseries/${editing.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'nurseries', editing.id), { imageUrl: url })
        }
        toast.success('Updated')
      } else {
        const docRef = await addDoc(collection(db, 'nurseries'), { ...data, ownerId: user.uid, createdAt: serverTimestamp() })
        if (file) {
          const storageRef = ref(storage, `nurseries/${docRef.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'nurseries', docRef.id), { imageUrl: url })
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
    if (!confirm('Delete this nursery?')) return
    try {
      await deleteDoc(doc(db, 'nurseries', id))
      toast.success('Deleted')
      await load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nurseries</h1>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="rounded-md bg-indigo-600 px-4 py-2 text-white">Add Nursery</button>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 font-medium">{editing ? 'Edit Nursery' : 'New Nursery'}</h2>
          <NurseryForm value={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">City</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={4}>Loading...</td></tr>
            ) : items.length ? (
              items.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-2">
                    {n.imageUrl ? <img src={n.imageUrl} alt="nursery" className="h-12 w-12 rounded object-cover" /> : '-'}
                  </td>
                  <td className="px-4 py-2">{n.name}</td>
                  <td className="px-4 py-2">{n.city}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => { setEditing(n); setShowForm(true) }} className="rounded-md border px-3 py-1">Edit</button>
                    <button onClick={() => remove(n.id)} className="rounded-md border px-3 py-1">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td className="px-4 py-3" colSpan={4}>No nurseries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
