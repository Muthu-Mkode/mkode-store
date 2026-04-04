import { createContext, useState, useContext, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const response = await api.get('/profile/')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const login = (access, refresh) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    fetchUser()
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}