import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLoginRequest = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/request-otp/', { email, password, action: 'login' })
      setStep(2)
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/login-with-otp/', { email, password, otp })
      login(response.data.access, response.data.refresh) 
      navigate('/store')
    } catch (err) {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) return null

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/5 border border-gray-100">
        
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-500 font-medium">Enter your details to securely access your assets.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleLoginRequest} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-sm font-bold text-gray-900">Password</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500 font-medium">
              Don't have an account? <Link to="/register" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">Sign up</Link>
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft size={24} />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Two-Factor Auth</h1>
              <p className="text-gray-500 font-medium">We sent a secure 6-digit code to <span className="text-gray-900 font-bold">{email}</span></p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleVerifyLogin} className="flex flex-col gap-5">
              <div>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[1em] text-3xl py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-gray-900 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || otp.length < 6}
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default Login