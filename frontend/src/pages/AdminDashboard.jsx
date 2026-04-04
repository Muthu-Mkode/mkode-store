import { useState, useEffect } from 'react'
import { 
  Upload, PlusCircle, AlertCircle, CheckCircle2, 
  LayoutDashboard, Settings, Package, Wallet, 
  Users, TrendingUp, Edit, Trash2, X, Save
} from 'lucide-react'
import api from '../api'
import { useStore } from '../context/StoreContext'

const AdminDashboard = () => {
  const { showToast } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({ total_revenue: 0, total_customers: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', price: '', category: 'Full Stack', description: ''
  })
  const [image, setImage] = useState(null)
  const [zipFile, setZipFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const categories = ["Full Stack", "Frontend", "Backend", "UI Kits", "Mobile Apps", "Machine Learning", "Games"]

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [projectsRes, statsRes] = await Promise.all([
        api.get('/projects/'),
        api.get('/admin-stats/')
      ])
      setProjects(projectsRes.data)
      setStats(statsRes.data)
    } catch (error) {
      showToast("Failed to fetch dashboard data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', price: '', category: 'Full Stack', description: '' })
    setImage(null)
    setZipFile(null)
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = new FormData()
    data.append('title', formData.title)
    data.append('subtitle', formData.subtitle)
    data.append('price', formData.price)
    data.append('category', formData.category)
    data.append('description', formData.description)
    if (image) data.append('image', image)
    if (zipFile) data.append('zip_file', zipFile)

    try {
      if (editingId) {
        await api.patch(`/projects/${editingId}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast("Project successfully updated!", "success")
        setActiveTab('manage')
      } else {
        await api.post('/projects/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        showToast("Project successfully uploaded to the store!", "success")
      }
      resetForm()
      fetchDashboardData()
    } catch (error) {
      showToast(editingId ? "Failed to update project." : "Failed to upload project.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return
    
    try {
      await api.delete(`/projects/${id}/`)
      showToast("Project deleted successfully.", "success")
      fetchDashboardData()
    } catch (error) {
      showToast("Failed to delete project.", "error")
    }
  }

  const startEdit = (project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      subtitle: project.subtitle || '',
      price: project.price,
      category: project.category,
      description: project.description
    })
    setActiveTab('add')
    window.scrollTo(0, 0)
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Console</h1>
              <p className="text-gray-500 font-medium text-lg">Manage your storefront and digital assets.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl inline-flex w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('overview'); resetForm(); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TrendingUp size={18} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'manage' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Settings size={18} /> Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'add' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {editingId ? <Edit size={18} /> : <PlusCircle size={18} />} 
            {editingId ? 'Edit Project' : 'Add New Project'}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Package size={24} />
              </div>
              <p className="text-gray-500 font-bold mb-1">Live Architectures</p>
              <h3 className="text-4xl font-black text-gray-900">{projects.length}</h3>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5 relative overflow-hidden">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Wallet size={24} />
              </div>
              <p className="text-gray-500 font-bold mb-1">Total Lifetime Revenue</p>
              <h3 className="text-4xl font-black text-gray-900">₹{stats.total_revenue.toFixed(2)}</h3>
              {stats.total_revenue > 0 && (
                <p className="text-xs font-bold text-emerald-500 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-md">Generating Profit</p>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <p className="text-gray-500 font-bold mb-1">Unique Customers</p>
              <h3 className="text-4xl font-black text-gray-900">{stats.total_customers}</h3>
            </div>

          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5 overflow-hidden">
            {isLoading ? (
              <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
            ) : projects.length === 0 ? (
              <div className="p-16 text-center text-gray-500 font-medium">No projects found. Add one to get started!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm font-bold uppercase tracking-wider">
                      <th className="p-6 font-bold">Project</th>
                      <th className="p-6 font-bold">Category</th>
                      <th className="p-6 font-bold">Price</th>
                      <th className="p-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6 flex items-center gap-4">
                          <img src={project.image_url} alt={project.title} className="w-16 h-12 object-cover rounded-lg bg-gray-100 border border-gray-200" />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{project.title}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{project.category}</span>
                        </td>
                        <td className="p-6 font-black text-gray-900">₹{project.price}</td>
                        <td className="p-6 text-right space-x-2">
                          <button onClick={() => startEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block" title="Edit Project">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block" title="Delete Project">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-900/5 p-8 md:p-12 relative overflow-hidden">
            
            {editingId && (
              <div className="absolute top-0 left-0 w-full bg-blue-50 text-blue-600 py-2 px-8 font-bold text-sm flex items-center justify-between">
                <span>Currently Editing: {formData.title}</span>
                <button onClick={() => {resetForm(); setActiveTab('manage')}} className="hover:text-blue-800 flex items-center gap-1"><X size={16}/> Cancel</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className={`flex flex-col gap-6 ${editingId ? 'mt-6' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Project Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleTextChange} placeholder="e.g., Django E-commerce" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Subtitle</label>
                  <input type="text" name="subtitle" value={formData.subtitle} onChange={handleTextChange} placeholder="e.g., Complete Scalable Backend" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Price (INR ₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
                    <input type="number" name="price" value={formData.price} onChange={handleTextChange} placeholder="999" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleTextChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-gray-700 bg-gray-50 focus:bg-white cursor-pointer">
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Full Description</label>
                <textarea name="description" value={formData.description} onChange={handleTextChange} rows="6" placeholder="Detail the tech stack and features..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-900 bg-gray-50 focus:bg-white" required></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Cover Image {editingId && <span className="text-gray-400 font-normal ml-2">(Leave empty to keep current)</span>}</label>
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer" required={!editingId} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Source Code (.zip) {editingId && <span className="text-gray-400 font-normal ml-2">(Leave empty to keep current)</span>}</label>
                  <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-all cursor-pointer" required={!editingId} />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 shadow-xl shadow-gray-900/20 disabled:opacity-70">
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Processing...</>
                  ) : editingId ? (
                    <><Save size={20} /> Save Changes</>
                  ) : (
                    <><PlusCircle size={20} /> Publish to Store</>
                  )}
                </button>
              </div>
              
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard