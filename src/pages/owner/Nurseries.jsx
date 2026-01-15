import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import NurseryForm from '../../components/forms/NurseryForm'
import Table, { TableCell, TableRow } from '../../components/common/Table'
import Button from '../../components/common/Button'
import { Plus, Pencil, Trash2, Sprout } from 'lucide-react'

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
        toast.success('Updated successfully')
      } else {
        const docRef = await addDoc(collection(db, 'nurseries'), { ...data, ownerId: user.uid, createdAt: serverTimestamp() })
        if (file) {
          const storageRef = ref(storage, `nurseries/${docRef.id}/${file.name}`)
          await uploadBytes(storageRef, file)
          const url = await getDownloadURL(storageRef)
          await updateDoc(doc(db, 'nurseries', docRef.id), { imageUrl: url })
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
    if (!confirm('Are you sure you want to delete this nursery?')) return
    try {
      await deleteDoc(doc(db, 'nurseries', id))
      toast.success('Deleted successfully')
      await load()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="w-full h-full bg-white py-2 px-4 font-['Inter',sans-serif]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl mb-2 text-gray-900 font-extrabold">Manage Nurseries</h3>
          <p className="text-base text-gray-600 mb-0 font-normal">
            Add or update your nursery locations.
          </p>
          <hr className="mt-4 border-gray-100 opacity-50" />
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true) }}>
          <Plus size={18} className="mr-2" /> Add Nursery
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">{editing ? 'Edit Nursery' : 'New Nursery'}</h2>
          <NurseryForm value={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Table headers={['Image', 'Name', 'City', 'Actions']}>
          {loading ? (
            <TableRow><TableCell className="text-center py-8" colSpan={4}>Loading nurseries...</TableCell></TableRow>
          ) : items.length ? (
            items.map((n) => (
              <TableRow key={n.id}>
                <TableCell>
                  {n.imageUrl ? (
                    <img src={n.imageUrl} alt="nursery" className="h-12 w-12 rounded-lg object-cover border border-slate-100 shadow-sm" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Sprout size={20} />
                    </div>
                  )}
                </TableCell>
                <TableCell><span className="font-medium text-slate-700">{n.name}</span></TableCell>
                <TableCell>{n.city}</TableCell>
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
            <TableRow><TableCell className="text-center py-8 text-slate-400" colSpan={4}>No nurseries found. Click "Add Nursery" to create one.</TableCell></TableRow>
          )}
        </Table>
      </div>
    </div>
  )
}
