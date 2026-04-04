import { Link } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import api from '../api'
import { useStore } from '../context/StoreContext'

const Cart = () => {
  const { cart, refreshCart, showToast } = useStore()

  const handleRemove = async (id) => {
    try {
      await api.delete(`/cart/${id}/`)
      refreshCart()
      showToast("Item removed from cart", "error")
    } catch (e) {
      showToast("Failed to remove item", "error")
    }
  }

  const total = cart.reduce((sum, item) => sum + parseFloat(item.project.price), 0)

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Your Cart<span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            Review your selected architectures before securely proceeding to checkout.
          </p>
          
          {cart.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'} in Cart
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
              Looks like you haven't added any digital products to your cart yet.
            </p>
            <Link 
              to="/store" 
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 hover:-translate-y-1"
            >
              Browse Store <ArrowRight size={20} />
            </Link>
          </div>

        ) : (
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-8 flex flex-col gap-6">
              {cart.map(item => (
                <div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5 group"
                >
                  <div className="w-full sm:w-48 aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                    <img 
                      src={item.project.image_url} 
                      alt={item.project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-grow w-full text-center sm:text-left">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                      {item.project.category}
                    </span>
                    <Link to={`/project/${item.project.id}`}>
                      <h3 className="text-xl font-black text-gray-900 hover:text-blue-600 transition-colors leading-tight mb-2">
                        {item.project.title}
                      </h3>
                    </Link>
                    <p className="text-2xl font-black text-gray-900 sm:hidden mt-4 mb-4">
                      ₹{item.project.price}
                    </p>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-6">
                    <p className="text-2xl font-black text-gray-900 hidden sm:block">
                      ₹{item.project.price}
                    </p>
                    <button 
                      onClick={() => handleRemove(item.id)} 
                      className="w-full sm:w-auto flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-bold text-sm transition-all"
                    >
                      <Trash2 size={18} /> <span className="sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-4 relative">
              <div className="sticky top-32 bg-white rounded-[2.5rem] p-8 border border-gray-200 shadow-xl shadow-gray-900/5">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Taxes</span>
                    <span className="text-gray-400 italic">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="h-px w-full bg-gray-100 mb-6"></div>
                
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-4xl font-black text-blue-600">₹{total.toFixed(2)}</span>
                </div>
                
                <Link 
                  to="/checkout" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 hover:-translate-y-1 mb-6"
                >
                  Checkout All <ArrowRight size={20} />
                </Link>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  Secure, encrypted checkout.
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart