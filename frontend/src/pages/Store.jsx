import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, PackageX, ChevronUp, Loader2 } from 'lucide-react'
import api from '../api'
import ProjectCard from '../components/ProjectCard'

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [visibleCount, setVisibleCount] = useState(6)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    api.get('/projects/').then(res => {
      setProjects(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true)
      } else {
        setShowScrollBtn(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredProjects = projects.filter(p => {
    const searchTerm = searchQuery.toLowerCase().trim()
    if (!searchTerm) return true
    
    return (
      p.title.toLowerCase().includes(searchTerm) || 
      p.category.toLowerCase().includes(searchTerm)
    )
  })

  const displayedProjects = filteredProjects.slice(0, visibleCount)

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6)
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa] relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-20 mt-8">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Store<span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-10 leading-relaxed">
            Explore my complete collection of handcrafted architectures, utility tools, and source codes.
          </p>
          
          <div className="w-full max-w-2xl relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={22} />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              value={searchQuery}
              className="w-full pl-16 pr-8 py-5 bg-white border border-gray-200 rounded-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-lg shadow-sm hover:shadow-md"
              onChange={(e) => {
                setSearchParams({ search: e.target.value })
                setVisibleCount(6)
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-[450px] bg-gray-200 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : filteredProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
              {displayedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            {visibleCount < filteredProjects.length && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-200 text-gray-900 font-bold py-4 px-10 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-2"
                >
                  <Loader2 size={18} className="text-gray-400" />
                  Load More Projects
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageX size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No creations found</h3>
            <p className="text-gray-500 font-medium">Try searching for a different keyword or category.</p>
            <button 
              onClick={() => {
                setSearchParams({})
                setVisibleCount(6)
              }}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 ${
          showScrollBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} strokeWidth={2.5} />
      </button>
      
    </div>
  )
}

export default Store