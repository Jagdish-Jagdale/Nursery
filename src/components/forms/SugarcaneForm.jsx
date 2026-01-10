import { useEffect, useState } from 'react'

export default function SugarcaneForm({ value, nurseries, onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', variety: '', price: '', stock: '', nurseryId: '' })
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (value) setForm({
      name: value.name || '',
      variety: value.variety || '',
      price: value.price || '',
      stock: value.stock || '',
      nurseryId: value.nurseryId || '',
    })
  }, [value])

  const submit = (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price || 0), stock: parseInt(form.stock || 0, 10) }
    onSave(payload, file)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Variety</label>
          <input value={form.variety} onChange={(e) => setForm({ ...form, variety: e.target.value })} required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Price</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Stock</label>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">Nursery</label>
          <select value={form.nurseryId} onChange={(e) => setForm({ ...form, nurseryId: e.target.value })} required className="w-full rounded-md border bg-white px-3 py-2 dark:bg-gray-900">
            <option value="">Select nursery</option>
            {nurseries.map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-md border px-3 py-2" />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white" type="submit">Save</button>
        <button className="rounded-md border px-4 py-2" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
