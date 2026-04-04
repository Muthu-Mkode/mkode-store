import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const Terms = () => {
  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-10 transition-colors">
          <ChevronLeft size={20} /> Back to Home
        </Link>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-xl shadow-gray-900/5 p-8 md:p-16">
          <div className="mb-12 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Terms of Service</h1>
            <p className="text-gray-500 font-medium">Last updated: April 2026</p>
          </div>

          <div className="prose max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using the Mkode platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services or purchase digital products.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Digital Products</h2>
              <p>Mkode provides digital products, including but not limited to software architectures, source code, and developer tools. Due to the nature of digital goods, all sales are final, and we generally do not offer refunds once the source code has been downloaded.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p>When you create an account, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p>While you purchase a license to use our source code (see Licensing agreement), the underlying intellectual property and brand identity of Mkode remain the exclusive property of the developer.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to Terms</h2>
              <p>We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by updating the date at the top of this page.</p>
            </section>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Terms