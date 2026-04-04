import { useState, useEffect } from 'react'
import { PackageX, ArrowRight, Download, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api'

const Library = () => {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/purchases/')
      .then(res => {
        setPurchases(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleSecureDownload = (url) => {
    const tempLink = document.createElement('a')
    tempLink.href = url
    tempLink.target = '_blank'
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-16 mt-8">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Library<span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            Your personal vault. Access and download the source codes for all your acquired architectures and tools.
          </p>
          
          {!loading && purchases.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100">
              {purchases.length} {purchases.length === 1 ? 'Item' : 'Items'} Owned
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(n => <div key={n} className="h-[450px] bg-gray-200 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {purchases.map(purchase => (
              <div key={purchase.id} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col relative">
                
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img 
                    src={purchase.project.image_url} 
                    alt={purchase.project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="glass-effect bg-white/70 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/50 shadow-sm">
                      {purchase.project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {purchase.project.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 font-medium mb-8">
                    Acquired on {new Date(purchase.purchased_at).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-3 z-10">
                    <Link 
                      to={`/project/${purchase.project.id}`} 
                      className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-2xl transition-all border border-gray-200"
                    >
                      <ExternalLink size={18} />
                      <span className="text-sm">Details</span>
                    </Link>
                    
                    <button 
                      onClick={() => handleSecureDownload(purchase.project.zip_url)}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Download size={18} />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Your vault is empty</h3>
            <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
              You haven't added any creations to your library yet. Browse the store to find your next project.
            </p>
            <Link 
              to="/store" 
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold py-4 px-10 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 hover:-translate-y-1"
            >
              Browse Store <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library