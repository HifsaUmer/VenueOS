import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cn } from '../utils/cn'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'CLIENT' as const })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TODO: Replace with actual API call once backend is ready
      // const res = await api.post('/auth/register', formData)
      // Mock response for now
      const res = {
        data: {
          user: {
            id: '1',
            email: formData.email,
            name: formData.name,
            role: formData.role,
          },
          accessToken: 'mock-token-123',
        },
      }

      setAuth(res.data.user, res.data.accessToken)
      
      if (formData.role === 'CLIENT') {
        navigate('/client')
      } else {
        navigate('/coordinator')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className={cn(
            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className={cn(
            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={cn(
            'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none',
            error ? 'border-red-500' : 'border-gray-300'
          )}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as any })
          }
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="CLIENT">Client</option>
          <option value="COORDINATOR">Coordinator</option>
          <option value="OPERATIONS">Operations</option>
          <option value="FINANCE">Finance</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
