import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { ROLES } from '../../utils/roles'

export default function SuperAdminOverview() {
  const [stats, setStats] = useState({ total: 0, superadmins: 0, admins: 0, users: 0 })

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'users'))
      const all = snap.docs.map((d) => d.data())
      const s = all.reduce(
        (acc, u) => {
          acc.total += 1
          if (u.role === ROLES.SUPERADMIN) acc.superadmins += 1
          else if (u.role === ROLES.ADMIN) acc.admins += 1
          else acc.users += 1
          return acc
        },
        { total: 0, superadmins: 0, admins: 0, users: 0 }
      )
      setStats(s)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SuperAdmin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Users" value={stats.total} />
        <Card title="SuperAdmins" value={stats.superadmins} />
        <Card title="Admins" value={stats.admins} />
        <Card title="Users" value={stats.users} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
