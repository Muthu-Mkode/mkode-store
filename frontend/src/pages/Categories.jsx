import { Link } from 'react-router-dom'
import { Layers, Smartphone, Gamepad2, ArrowRight } from 'lucide-react'

const Categories = () => {
  const categoriesData = [
    {
      name: "Full Stack",
      description: "End-to-end architectures, combining robust backends with dynamic frontends.",
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
      shadow: "hover:shadow-blue-900/5"
    },
    {
      name: "Mobile Apps",
      description: "React Native and cross-platform mobile solutions ready for app stores.",
      icon: Smartphone,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "hover:border-orange-200",
      shadow: "hover:shadow-orange-900/5"
    },
    {
      name: "Games",
      description: "Fun, simple indie games and interactive experiences built from scratch.",
      icon: Gamepad2,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "hover:border-purple-200",
      shadow: "hover:shadow-purple-900/5"
    }
  ]

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
            Categories<span className="text-blue-600">.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl">
            Browse my creations by technology stack. Find exactly what you need for your next big project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesData.map((category) => (
            <Link 
              key={category.name}
              to={`/store?search=${encodeURIComponent(category.name)}`} 
              className={`group bg-white p-8 rounded-[2rem] border border-gray-100 ${category.border} ${category.shadow} hover:shadow-xl transition-all duration-300 flex flex-col h-full`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${category.bg} ${category.color} group-hover:scale-110 transition-transform duration-500`}>
                  <category.icon size={32} strokeWidth={1.5} />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed flex-grow">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Categories