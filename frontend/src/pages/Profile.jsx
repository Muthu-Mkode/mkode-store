import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, AlertTriangle, Edit2, Save, Loader2, Camera, X, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import api from '../api'

const Profile = () => {
  const { logout } = useAuth()
  const { showToast } = useStore()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({ name: '', email: '', profile_picture_url: null })
  const [originalData, setOriginalData] = useState({ name: '', email: '', profile_picture_url: null })
  
  const [newImageFile, setNewImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [removeImage, setRemoveImage] = useState(false)

  useEffect(() => {
    api.get('/profile/')
      .then(res => {
        const data = { 
          name: res.data.name || '', 
          email: res.data.email || '',
          profile_picture_url: res.data.profile_picture_url || null
        }
        setUserData(data)
        setOriginalData(data)
        setLoading(false)
      })
      .catch(() => {
        showToast("Failed to load profile data", "error")
        setLoading(false)
      })
  }, [showToast])

  const handleTextChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setRemoveImage(false)
    }
  }

  const handleRemoveImage = () => {
    setRemoveImage(true)
    setImagePreview(null)
    setNewImageFile(null)
    setUserData({ ...userData, profile_picture_url: null })
  }

  const cancelEditing = () => {
    setUserData(originalData)
    setNewImageFile(null)
    setImagePreview(null)
    setRemoveImage(false)
    setIsEditing(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData()
    formData.append('name', userData.name)
    formData.append('email', userData.email)
    
    if (removeImage) {
      formData.append('remove_picture', 'true')
    } else if (newImageFile) {
      formData.append('profile_picture', newImageFile)
    }
    
    try {
      await api.put('/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setIsEditing(false)
      showToast("Profile updated successfully!", "success")
      
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      showToast("Failed to update profile.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleConfirmLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-900/5 overflow-hidden">
          
          {loading ? (
             <div className="p-24 flex justify-center items-center">
               <Loader2 className="animate-spin text-blue-600" size={40} />
             </div>
          ) : (
            <div className="p-10 md:p-12">
              
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="w-full h-full bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-blue-900/10 overflow-hidden">
                  {imagePreview || userData.profile_picture_url ? (
                    <img 
                      src={imagePreview || userData.profile_picture_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={56} strokeWidth={1.5} />
                  )}
                </div>
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-4 flex gap-2">
                    {(imagePreview || userData.profile_picture_url) && (
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white p-2.5 rounded-full border-4 border-white shadow-lg hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
                        title="Remove Photo"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-600 text-white p-2.5 rounded-full border-4 border-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
                      title="Change Photo"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {!isEditing ? (
                <div className="text-center animate-in fade-in duration-300">
                  <h2 className="text-3xl font-black text-gray-900 capitalize tracking-tight mb-2">
                    {originalData.name || 'Developer'}
                  </h2>
                  <p className="text-gray-500 font-medium mb-10">
                    {originalData.email}
                  </p>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
                    >
                      <Edit2 size={18} /> Edit Profile
                    </button>
                    
                    <button 
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-5 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={userData.name} 
                      onChange={handleTextChange} 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 pl-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={userData.email} 
                      onChange={handleTextChange} 
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" 
                      required 
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Save Changes
                    </button>
                    <button 
                      type="button"
                      onClick={cancelEditing}
                      className="w-full bg-white text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-colors flex justify-center items-center gap-2"
                    >
                      <X size={20} /> Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>

      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white max-w-sm w-full rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto border-8 border-white shadow-sm">
              <AlertTriangle size={36} strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 text-center mb-3 tracking-tight">Sign out?</h3>
            <p className="text-gray-500 text-center font-medium mb-8">
              You will need to log back in to access your digital library.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmLogout}
                className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
              >
                Yes, Sign Out
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full bg-gray-100 text-gray-900 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile