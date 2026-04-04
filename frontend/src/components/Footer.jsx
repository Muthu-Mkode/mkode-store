import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const LinkedinIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const Footer = () => {
  const { isAuthenticated } = useAuth()
  
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/muthukumaran-mk"
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "muthu17ks@gmail.com"

  return (
    <footer className="bg-gray-950 border-t border-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-2">
            
            {/* BRANDING */}
            <Link to="/" className="text-2xl font-black tracking-tighter mb-4 inline-block">
              <span className="text-blue-500">M</span><span className="text-white">KODE</span>
            </Link>
            
            <p className="text-gray-400 font-medium max-w-sm mb-8 leading-relaxed">
              A curated collection of production-ready architectures, indie games, and developer tools. Built from scratch, designed to scale.
            </p>
            <div className="flex gap-4">
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="text-gray-400 bg-gray-900 p-3 rounded-xl border border-gray-800 hover:border-blue-500/50 hover:text-blue-500 transition-colors shadow-lg">
                <LinkedinIcon size={20} />
              </a>
              <a href={`mailto:${contactEmail}`} className="text-gray-400 bg-gray-900 p-3 rounded-xl border border-gray-800 hover:border-red-500/50 hover:text-red-500 transition-colors shadow-lg">
                <Mail size={20} strokeWidth={2} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 tracking-wider uppercase text-sm">Navigation</h4>
            <ul className="flex flex-col gap-4 font-medium text-gray-400">
              <li><Link to="/store" className="hover:text-blue-500 transition-colors inline-block">Browse Store</Link></li>
              <li><Link to="/categories" className="hover:text-blue-500 transition-colors inline-block">Categories</Link></li>
              
              {/* DYNAMIC LINKS: Only show if logged in */}
              {isAuthenticated && (
                <>
                  <li><Link to="/library" className="hover:text-blue-500 transition-colors inline-block">My Library</Link></li>
                  <li><Link to="/profile" className="hover:text-blue-500 transition-colors inline-block">Profile</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 tracking-wider uppercase text-sm">Legal</h4>
            <ul className="flex flex-col gap-4 font-medium text-gray-400">
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/license" className="hover:text-blue-500 transition-colors">Licensing</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-gray-500">
          <p>© {new Date().getFullYear()} Mkode. All rights reserved.</p>
          <p>Crafted with precision by Mkode.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer