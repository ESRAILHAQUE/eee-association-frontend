import { Mail } from 'lucide-react'

export default function Newsletter() {
  const newsletterItems = [
    'Upcoming technical events and workshops',
    'Research collaboration opportunities',
    'Industry partnership announcements',
    'Career development resources',
    'Student achievement highlights'
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Never Miss Important Updates
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Subscribe to receive exclusive updates on events, research opportunities, and industry insights delivered to your inbox.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Join Our Professional Network
                </h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Get exclusive access to:
                </p>
                <div className="space-y-3 mb-8">
                  {newsletterItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none backdrop-blur-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none backdrop-blur-sm"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none backdrop-blur-sm"
                />
                <select className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/30 focus:border-transparent focus:outline-none backdrop-blur-sm">
                  <option value="" className="text-slate-800">Select Your Interest</option>
                  <option value="student" className="text-slate-800">Current Student</option>
                  <option value="alumni" className="text-slate-800">Alumni</option>
                  <option value="faculty" className="text-slate-800">Faculty</option>
                  <option value="industry" className="text-slate-800">Industry Professional</option>
                </select>
                <button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
                  Subscribe to Newsletter
                  <Mail className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-slate-400 text-center">
                  We respect your privacy. Unsubscribe anytime with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}