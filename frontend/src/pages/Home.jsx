import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Terminal, Gamepad2, Zap, CheckCircle2, Shield } from 'lucide-react'

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center px-6 overflow-hidden">
        
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-blue-400/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center w-full mt-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter mb-6 md:mb-8 leading-[1.1] sm:leading-[1.1]">
            My Personal Lab, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Now Open to You.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
            Welcome to my personal storefront. Everything you see here was built from scratch by me—from full-stack web architectures and mini-apps, to automation scripts and indie games. 
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/store" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 hover:-translate-y-1 hover:shadow-2xl">
              Browse My Creations <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">What's Inside The Store?</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto">A curated collection of my digital products, ready for you to use or learn from.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-8 group-hover:scale-110 transition-transform duration-500 text-blue-600">
                <Code2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Full-Stack Apps</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Complete, production-ready web applications built with modern stacks like React and Django. Perfect for accelerating your own startup or learning advanced patterns.
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-8 group-hover:scale-110 transition-transform duration-500 text-emerald-600">
                <Terminal size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Scripts & Tools</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Handy automation scripts, mini-utilities, and productivity tools that solve specific problems. Plug them directly into your daily workflow.
              </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-8 group-hover:scale-110 transition-transform duration-500 text-purple-600">
                <Gamepad2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Indie Games</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Fun, simple games and interactive experiences I've coded up. Grab the source code to see how game logic is built, or just play them for fun!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 px-6 bg-[#fafafa] border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-blue-200">
              <Shield size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Direct from the Developer</h2>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
              No middlemen, no bloated corporate code. When you buy a product here, you are getting the exact source code I wrote, securely transferred from my local machine directly to your library. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-blue-600">
                <Zap size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Instant Access</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Download the source code immediately after checkout. No waiting periods, no confusing license keys.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-emerald-600">
                <Code2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Clean Code</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Every file is logically structured and written with best practices, making it incredibly easy for you to tweak and customize.
              </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 text-purple-600">
                <CheckCircle2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Own It Forever</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                A simple, one-time payment. Once you add it to your library, it's yours to use in your personal or commercial projects indefinitely.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home