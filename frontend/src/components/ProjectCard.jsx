import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Zap, Trash2, CheckCircle2 } from 'lucide-react'
import api from '../api'
import { useStore } from '../context/StoreContext'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  const { cart, refreshCart, purchases, showToast } = useStore()

  const cartItem = cart.find(item => item.project.id === project.id)
  const inCart = !!cartItem

  const isOwned = purchases.some(item => item.project.id === project.id)

  const toggleCart = async (e) => {
    e.preventDefault() 
    try {
      if (inCart) {
        await api.delete(`/cart/${cartItem.id}/`)
        showToast("Removed from cart", "error")
      } else {
        await api.post('/cart/', { project_id: project.id })
        showToast("Added to cart successfully!", "success")
      }
      refreshCart() 
    } catch (error) {
      showToast("You must be logged in to do that.", "error")
    }
  }

  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col relative">
      <Link to={`/project/${project.id}`} className="flex-grow flex flex-col cursor-pointer">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-4 left-4">
            <span className="glass-effect bg-white/70 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/50 shadow-sm">{project.category}</span>
          </div>
        </div>
        <div className="p-8 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{project.title}</h3>
            <p className="text-2xl font-black text-gray-900">₹{project.price}</p>
          </div>
          <p className="text-gray-500 font-medium text-sm mb-6 line-clamp-2">{project.description}</p>
        </div>
      </Link>

      <div className="px-8 pb-8 mt-auto z-10">
        {/* CONDITIONAL RENDERING BASED ON OWNERSHIP */}
        {isOwned ? (
          <Link 
            to="/library" 
            className="flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold py-3.5 rounded-2xl transition-all shadow-sm"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm">In Your Library</span>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={toggleCart}
              className={`flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all border ${
                inCart ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' : 'bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-600 border-gray-200 hover:border-blue-200'
              }`}
            >
              {inCart ? <Trash2 size={18} /> : <ShoppingCart size={18} />}
              <span className="text-sm">{inCart ? 'Remove' : 'Cart'}</span>
            </button>
            
            <button 
              onClick={async () => {
                if (!inCart) {
                  await api.post('/cart/', { project_id: project.id })
                  refreshCart()
                }
                navigate('/checkout')
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
            >
              <Zap size={18} fill="currentColor" />
              <span className="text-sm">Buy Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard