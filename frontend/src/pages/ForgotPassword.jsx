import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Key, ArrowRight, AlertCircle, ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import api from '../api'

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/request-otp/', { email, action: 'reset_password' })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.')
    }

    if (newPassword.length < 8) {
      return setError('Password must be at least 8 characters long.')
    }

    setLoading(true)

    try {
      await api.post('/reset-password/', { email, otp, new_password: newPassword })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/5 border border-gray-100">
        
        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <Link to="/login" className="inline-block text-gray-400 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft size={24} />
            </Link>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-500 font-medium">Enter your email and we'll send you a verification code.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleRequestReset} className="flex flex-col gap-5">
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Code'} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">Secure Reset</h1>
              <p className="text-gray-500 font-medium">Enter the 6-digit code sent to <span className="text-gray-900 font-bold">{email}</span></p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[1em] text-3xl py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-gray-900 bg-gray-50 focus:bg-white mb-2"
                  required
                />
              </div>

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
                disabled={loading || otp.length < 6 || !newPassword || !confirmPassword}
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex justify-center items-center gap-2 shadow-xl shadow-blue-600/20 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Password & Login'}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="text-center animate-in zoom-in duration-300 py-6">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">All set!</h1>
            <p className="text-gray-500 font-medium mb-8">Your password has been successfully reset. You can now log in with your new credentials.</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/10"
            >
              Go to Login
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword