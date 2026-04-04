import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, Lock, Loader2, ExternalLink } from 'lucide-react'
import api from '../api'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, refreshCart, showToast } = useStore()
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)

  const total = cart.reduce((sum, item) => sum + parseFloat(item.project.price), 0)

  const handleRazorpayCheckout = async () => {
    setProcessing(true)
    
    try {
      const { data } = await api.post('/cart/create_order/')
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: data.currency,
        name: "Mkode Store",
        description: "Premium Digital Architectures",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            await api.post('/cart/verify_payment/', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
            
            refreshCart() 
            showToast("Payment successful! Architectures added to Library.", "success")
            navigate('/library')
          } catch (err) {
            showToast("Payment verification failed. Please contact support.", "error")
            setProcessing(false)
          }
        },
        prefill: {
          name: user?.username || "User",
          email: user?.email || "",
        },
        theme: {
          color: "#2563EB"
        }
      }
      
      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response){
        showToast("Payment was cancelled or failed.", "error")
        setProcessing(false)
      })
      
      rzp.open()
      
    } catch (error) {
      showToast("Failed to initialize payment gateway.", "error")
      setProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-[#fafafa] flex flex-col items-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <Link to="/store" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">
          Browse Store
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-200/50 shadow-xl shadow-gray-900/5 flex flex-col">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Order Summary</h2>
          
          <div className="flex-grow overflow-y-auto pr-4 space-y-6 mb-8 max-h-[40vh] custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.project.image_url} alt={item.project.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{item.project.title}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.project.category}</p>
                </div>
                <div className="font-black text-gray-900 text-lg">
                  ₹{item.project.price}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-100 mt-auto">
            <div className="flex justify-between items-center mb-3 text-gray-500 font-medium">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-8 text-gray-500 font-medium">
              <span>Taxes</span>
              <span className="italic text-sm">Included in price</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-black text-gray-900">Total Due</span>
              <span className="text-4xl font-black text-blue-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="text-center mb-10 relative z-10">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-700">
              <Lock className="text-blue-400" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Secure Payment</h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              You will be securely redirected to Razorpay to complete your purchase using UPI, Card, or Netbanking.
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 text-gray-400 text-sm font-medium bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
              <ShieldCheck className="text-emerald-400" size={20} />
              End-to-end encrypted processing
            </div>
            
            <button 
              onClick={handleRazorpayCheckout} 
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-70 mt-6"
            >
              {processing ? (
                <><Loader2 className="animate-spin" size={24} /> Initiating Payment...</>
              ) : (
                <>Pay ₹{total.toFixed(2)} Securely <ExternalLink size={20} /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout