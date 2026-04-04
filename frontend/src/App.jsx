import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Store from './pages/Store'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import Library from './pages/Library'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import ProjectDetails from './pages/ProjectDetails'
import Checkout from './pages/Checkout'
import ScrollToTop from './components/ScrollToTop' 
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import License from './pages/License'
import ForgotPassword from './pages/ForgotPassword'

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <ScrollToTop /> 
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/library" element={<Library />} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/license" element={<License />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App