import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, AlertCircle, ArrowLeft, Send, Loader2 } from 'lucide-react'
import api from '../api'

const ForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call the new magic link endpoint
      await api.post('/request-access/', { email, action: 'reset_password' })
      setStep(2) // Move to the success/check-email screen
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-900/5 border border-gray-100 relative overflow-hidden">
        
        {/* STEP 1: REQUEST MAGIC LINK */}
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <Link to="/login" className="inline-block text-gray-400 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft size={24} />
            </Link>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-500 font-medium">Enter your email and we'll send you a secure reset link.</p>
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
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'} 
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
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
              We sent a secure password reset link to <br/>
              <span className="text-gray-900 font-black">{email}</span>
            </p>
            
            <p className="text-sm text-gray-400 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100">
              Click the link in the email to set your new password. You can close this window.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword