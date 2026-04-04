import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, Library, LayoutDashboard, Store as StoreIcon, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'

const Navbar = () => {
  const { isAuthenticated, user } = useAuth()
  const { cart } = useStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const location = useLocation()

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMenu = () => setIsMobileMenuOpen(false)

  const navLinkClass = (path) => {
    return location.pathname === path 
      ? 'text-blue-600 font-bold' 
      : 'text-gray-600 hover:text-blue-600 font-semibold transition-colors'
  }

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" onClick={closeMenu} className="text-2xl font-black tracking-tighter">
          <span className="text-blue-600">M</span><span className="text-gray-900">KODE</span>
        </Link>
        
        <div className="hidden md:flex gap-8 items-center text-sm">
          <Link to="/store" className={navLinkClass('/store')}>Store</Link>
          <Link to="/categories" className={navLinkClass('/categories')}>Categories</Link>
          
          {isAuthenticated && (
            <Link to="/library" className={navLinkClass('/library')}>
              Library
            </Link>
          )}
          
          {isAuthenticated && user?.is_admin && (
            <Link 
              to="/admin-dashboard" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/admin-dashboard' 
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20' 
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold'
              }`}
            >
              <LayoutDashboard size={16} /> Admin Console
            </Link>
          )}
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          <Link 
            to="/cart" 
            onClick={closeMenu} 
            className={`relative transition-colors ${location.pathname === '/cart' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-6">
            {isAuthenticated ? (
              <Link 
                to="/profile" 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow-sm overflow-hidden ${
                  location.pathname === '/profile'
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-blue-600 border-gray-200'
                }`}
              >
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} strokeWidth={2} />
                )}
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md shadow-gray-900/10">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button onClick={toggleMenu} className="md:hidden text-gray-900 ml-2">
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col px-6 py-4 gap-4 font-medium text-gray-700">
          <Link 
            to="/store" 
            onClick={closeMenu} 
            className={`py-2 border-b border-gray-50 flex items-center gap-2 ${location.pathname === '/store' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
          >
            <StoreIcon size={18} /> Store
          </Link>
          <Link 
            to="/categories" 
            onClick={closeMenu} 
            className={`py-2 border-b border-gray-50 flex items-center gap-2 ${location.pathname === '/categories' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
          >
            <Layers size={18} /> Categories
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/library" 
                onClick={closeMenu} 
                className={`py-2 border-b border-gray-50 flex items-center gap-2 ${location.pathname === '/library' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
              >
                <Library size={18} /> My Library
              </Link>
              
              {user?.is_admin && (
                <Link 
                  to="/admin-dashboard" 
                  onClick={closeMenu} 
                  className={`py-2 border-b border-gray-50 flex items-center gap-2 font-bold ${location.pathname === '/admin-dashboard' ? 'text-blue-700' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <LayoutDashboard size={18} /> Admin Console
                </Link>
              )}
              
              <Link 
                to="/profile" 
                onClick={closeMenu} 
                className={`py-2 flex items-center gap-2 ${location.pathname === '/profile' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
              >
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User size={18} />
                )}
                Profile & Settings
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" onClick={closeMenu} className="bg-gray-100 text-center text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Log in
              </Link>
              <Link to="/register" onClick={closeMenu} className="bg-blue-600 text-center text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar