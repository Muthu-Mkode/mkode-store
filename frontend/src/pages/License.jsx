import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const License = () => {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-10 transition-colors">
          <ChevronLeft size={20} /> Back to Home
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-xl shadow-gray-900/5 p-8 md:p-16">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Licensing Agreement</h1>
            <p className="text-gray-500 font-medium">Standard License for Mkode Products</p>
          </div>

          <div className="prose max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
            <section>
              <p className="text-lg">When you purchase a digital product from Mkode, you are granted a non-exclusive, non-transferable right to use the source code under the following conditions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-emerald-600 mb-4">What you CAN do:</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>You may use the source code to build an unlimited number of personal projects.</li>
                <li>You may use the source code to build commercial applications for yourself or your clients (e.g., launching a SaaS or building a client's website).</li>
                <li>You may modify, alter, and tweak the code to suit your specific project needs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-red-500 mb-4">What you CANNOT do:</h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>You may not redistribute, resell, lease, license, or offer the source code "as-is" to any third party.</li>
                <li>You may not create a competing marketplace or template store using the unmodified code.</li>
                <li>You may not publicly host the source code in an open-source repository (e.g., a public GitHub repo) where others can download it for free.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Liability</h2>
              <p>The code is provided "as is" without warranty of any kind. In no event shall Mkode be liable for any damages arising out of the use or inability to use the code in your projects.</p>
            </section>
          </div>
        </div>

      </div>
    </div>
  )
}

export default License