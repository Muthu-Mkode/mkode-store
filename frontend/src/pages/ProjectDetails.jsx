import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, Zap, CheckCircle2, ShieldCheck, Code2, Download, Trash2, ChevronLeft, Loader2 } from 'lucide-react'
import api from '../api'
import { useStore } from '../context/StoreContext'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, refreshCart, purchases, showToast } = useStore()
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get(`/projects/${id}/`)
      .then(res => {
        setProject(res.data)
        setLoading(false)
      })
      .catch(() => {
        showToast("Failed to load project.", "error")
        navigate('/store')
      })
  }, [id, navigate, showToast])

  if (loading || !project) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex justify-center items-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    )
  }

  const cartItem = cart.find(item => item.project.id === project.id)
  const inCart = !!cartItem
  const isOwned = purchases.some(item => item.project.id === project.id)

  const toggleCart = async () => {
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
      navigate('/login')
    }
  }

  const handleBuyNow = async () => {
    try {
      if (!inCart) {
        await api.post('/cart/', { project_id: project.id })
        refreshCart()
      }
      navigate('/checkout')
    } catch (error) {
      showToast("Please log in to purchase.", "error")
      navigate('/login')
    }
  }

  const handleSecureDownload = () => {
    const tempLink = document.createElement('a')
    tempLink.href = project.zip_url
    tempLink.target = '_blank'
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link to="/store" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-10 transition-colors">
          <ChevronLeft size={20} /> Back to Store
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          <div className="md:col-span-8">
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl shadow-gray-900/5 border border-gray-200/50 bg-white h-full group">
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full h-full object-cover aspect-[16/10] md:aspect-auto md:absolute inset-0 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-6 left-6">
                <span className="glass-effect bg-white/90 backdrop-blur-md text-gray-900 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-900/5 border border-gray-200 flex flex-col">
            
            <div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-gray-500 font-medium text-sm mb-6 line-clamp-2">
                  {project.subtitle}
                </p>
              )}
              <div className="text-4xl font-black text-blue-600 mb-8">
                ₹{project.price}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <ShieldCheck className="text-blue-500" size={20} /> Lifetime access
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <Download className="text-emerald-500" size={20} /> Instant .zip download
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                <Code2 className="text-purple-500" size={20} /> Clean, modular code
              </div>
            </div>

            <div className="flex-grow"></div>

            <div className="pt-6 border-t border-gray-100">
              {isOwned ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 font-bold text-sm">
                    <CheckCircle2 size={18} /> In Library
                  </div>
                  <button 
                    onClick={handleSecureDownload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <Download size={20} /> Download Code
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleBuyNow}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2"
                  >
                    <Zap size={20} fill="currentColor" /> Buy Now
                  </button>
                  <button 
                    onClick={toggleCart}
                    className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl transition-all border-2 ${
                      inCart 
                        ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {inCart ? <Trash2 size={20} /> : <ShoppingCart size={20} />}
                    <span>{inCart ? 'Remove from Cart' : 'Add to Cart'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-gray-900/5 border border-gray-200/50">
          <h2 className="text-3xl font-black text-gray-900 mb-8 inline-flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Code2 size={16} strokeWidth={2.5} />
            </div>
            About this project
          </h2>
          
          <div className="prose max-w-none text-gray-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {project.description}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProjectDetails