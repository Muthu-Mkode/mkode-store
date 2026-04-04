import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const Privacy = () => {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-10 transition-colors">
          <ChevronLeft size={20} /> Back to Home
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-xl shadow-gray-900/5 p-8 md:p-16">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Privacy Policy</h1>
            <p className="text-gray-500 font-medium">Last updated: April 2026</p>
          </div>

          <div className="prose max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when creating an account, such as your name and email address. We do not store your credit card or payment details on our servers; these are handled entirely by our secure payment gateway partner (Razorpay).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our services.</li>
                <li>Process your transactions and deliver your purchased digital products.</li>
                <li>Send you technical notices, updates, security alerts, and support messages.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies and Tracking</h2>
              <p>We use essential cookies to maintain your login session and keep your shopping cart intact as you navigate the site. We do not use third-party invasive advertising trackers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. We utilize industry-standard encryption for data transmission.</p>
            </section>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Privacy