import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { ROLES } from '../../utils/roles'
import toast from 'react-hot-toast'

export default function UsersManage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
        const snap = await getDocs(q)
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      } catch (e) {
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const changeRole = async (id, role) => {
    try {
      await updateDoc(doc(db, 'users', id), { role })
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
      toast.success('Role updated')
    } catch (e) {
      toast.error('Failed to update role')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-3" colSpan={3}>Loading...</td>
              </tr>
            ) : users.length ? (
              users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.name || '-'}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.role || ROLES.USER}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-md border bg-white px-2 py-1 dark:bg-gray-900"
                    >
                      <option value={ROLES.USER}>User</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                      <option value={ROLES.SUPERADMIN}>SuperAdmin</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3" colSpan={3}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
