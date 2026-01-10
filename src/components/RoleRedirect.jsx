import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ROLES } from '../utils/roles'

export default function RoleRedirect() {
  const { user, role, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    if (role === ROLES.SUPERADMIN) navigate('/superadmin', { replace: true })
    else if (role === ROLES.ADMIN) navigate('/admin', { replace: true })
    else navigate('/user', { replace: true })
  }, [user, role, loading, navigate])

  return null
}
