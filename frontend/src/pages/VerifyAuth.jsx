import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Loader2, Key, ArrowRight, ShieldCheck } from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const VerifyAuth = () => {
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const action = searchParams.get('action')

  const navigate = useNavigate()
  const { login } = useAuth()

  // States: 'verifying', 'input_password', 'success', 'error'
  const [status, setStatus] = useState('verifying') 
  const [errorMsg, setErrorMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Prevent React strict mode double-firing
  const hasAttempted = useRef(false)

  useEffect(() => {
    if (!uid || !token || !action) {
      setStatus('error')
      setErrorMsg('Invalid verification link. Missing parameters.')
      return
    }

    if (action === 'reset_password') {
      setStatus('input_password')
      return
    }

    // If it's login or register, verify automatically
    if (!hasAttempted.current) {
      hasAttempted.current = true
      verifyToken()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token, action])

  const verifyToken = async (password = null) => {
    try {
      setLoading(true)
      const response = await api.post('/verify-access/', {
        uid,
        token,
        action,
        new_password: password
      })

      // Success: Log the user in with the returned JWT tokens
      login(response.data.access, response.data.refresh)
      setStatus('success')

      // Redirect to the store after a brief success message
      setTimeout(() => {
         navigate('/store')
      }, 2000)

    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.error || 'Verification failed. This link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return setErrorMsg('Passwords do not match.')
    }
    if (newPassword.length < 8) {
      return setErrorMsg('Password must be at least 8 characters long.')
    }
    setErrorMsg('')
    verifyToken(newPassword)
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/5 border border-gray-100">
        
        {/* STATE: Verifying (Loading) */}
        {status === 'verifying' && (
          <div className="text-center animate-in zoom-in duration-300 py-8">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-6" size={48} strokeWidth={1.5} />
            <h1 className="text-3xl font-black text-gray-900 mb-2">Verifying...</h1>
            <p className="text-gray-500 font-medium">Please wait while we securely authenticate your link.</p>
          </div>
        )}

        {/* STATE: Reset Password Input */}
        {status === 'input_password' && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Set New Password</h1>
              <p className="text-gray-500 font-medium">Link verified. Please choose a new secure password.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} className="shrink-0" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Confirm Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save & Login'} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        )}

        {/* STATE: Success */}
        {status === 'success' && (
          <div className="text-center animate-in zoom-in duration-300 py-8">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Authenticated!</h1>
            <p className="text-gray-500 font-medium">Securely verified. Redirecting you to the store...</p>
          </div>
        )}

        {/* STATE: Error */}
        {status === 'error' && (
          <div className="text-center animate-in zoom-in duration-300 py-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Verification Failed</h1>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              {errorMsg}
            </p>
            <Link 
              to="/login"
              className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/10"
            >
              Back to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default VerifyAuth