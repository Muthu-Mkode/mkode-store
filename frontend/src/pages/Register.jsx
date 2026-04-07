import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft, Send, Loader2 } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { isAuthenticated } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleRegisterRequest = async (e) => {
    e.preventDefault()
    setError('')
    
    // Basic validation before hitting the server
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.')
    }

    setLoading(true)

    try {
      // Send the data to the backend to create the account & send the magic link
      await api.post('/request-access/', { 
        name, 
        email, 
        password, 
        action: 'register' 
      })
      setStep(2) // Move to "Check your inbox" screen
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) return null

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/5 border border-gray-100 relative overflow-hidden">
        
        {/* STEP 1: REGISTRATION FORM */}
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500 font-medium">Join to purchase and download architectures.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleRegisterRequest} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

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
                <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Password</label>
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
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">Log in</Link>
            </p>
          </div>
        ) : (

        /* STEP 2: CHECK EMAIL SUCCESS */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
            <Link 
              to="/login"
              className="absolute top-8 left-8 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>

            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={36} className="ml-1" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-4">Check your inbox</h1>
            
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              We sent a secure verification link to <br/>
              <span className="text-gray-900 font-black">{email}</span>
            </p>
            
            <p className="text-sm text-gray-400 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
              Click the link in the email to activate your account and log in automatically.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Register