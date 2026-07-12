import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { cn } from '../utils/cn'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      // const res = await api.post('/auth/login', formData)
      // Mock response for now
      const res = {
        data: {
          user: {
            id: '1',
            email: formData.email,
            name: 'Test User',
            role: 'COORDINATOR' as 'CLIENT' | 'COORDINATOR' | 'ADMIN' | 'FINANCE' | 'OPERATIONS',
          },
          accessToken: 'mock-token-123',
        },
      }

      setAuth(res.data.user, res.data.accessToken)
      
      // Redirect based on role
      const role = res.data.user.role
      if (role === 'CLIENT') {
        navigate('/client')
      } else if (role === 'COORDINATOR') {
        navigate('/coordinator')
      } else if (role === 'ADMIN') {
        navigate('/admin')
      } else if (role === 'FINANCE') {
        navigate('/finance')
      } else if (role === 'OPERATIONS') {
        navigate('/operations')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  )
}
