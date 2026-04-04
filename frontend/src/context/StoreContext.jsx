import { createContext, useState, useEffect, useContext } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import api from '../api'
import { useAuth } from './AuthContext'

const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [purchases, setPurchases] = useState([])
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const { isAuthenticated } = useAuth()

  const refreshCart = async () => {
    if (!isAuthenticated) return setCart([])
    try {
      const res = await api.get('/cart/')
      setCart(res.data)
    } catch (error) {
      console.error("Error fetching cart")
    }
  }

  const refreshPurchases = async () => {
    if (!isAuthenticated) return setPurchases([])
    try {
      const res = await api.get('/purchases/')
      setPurchases(res.data)
    } catch (error) {
      console.error("Error fetching purchases")
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000)
  }

  useEffect(() => {
    refreshCart()
    refreshPurchases()
  }, [isAuthenticated])

  return (
    <StoreContext.Provider value={{ cart, refreshCart, purchases, refreshPurchases, showToast }}>
      {children}
      
      {toast.show && (
        <div className="fixed bottom-10 right-10 z-[9999] transition-all duration-300 transform translate-y-0 opacity-100">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
            'bg-red-50 text-red-600 border-red-200'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {toast.message}
            <button onClick={() => setToast({ show: false })} className="ml-4 opacity-50 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
