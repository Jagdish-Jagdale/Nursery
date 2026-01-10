import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(email, password, { name })
      toast.success('Account created')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Create account</h1>
        <div className="space-y-1">
          <label className="text-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-slate-300 bg-white px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-md border border-slate-300 bg-white px-3 py-2" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-md border border-slate-300 bg-white px-3 py-2" />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-indigo-600 px-3 py-2 text-white disabled:opacity-60">
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
