import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const socialIcons = [Facebook, Twitter, Instagram, Linkedin]
  const quickLinks = ['Home', 'About', 'Features', 'Events', 'Projects', 'Contact']

  return (
    <footer id="contact" className="bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src="/images/SEC-Logo.png" 
                  alt="SEC Logo" 
                  width={48} 
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Department of EEE</span>
                <p className="text-xs text-slate-400 -mt-1">Sylhet Engineering College</p>
              </div>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
              Empowering the next generation of electrical engineers through innovative technology, collaborative learning, and professional development.
            </p>
            <div className="flex space-x-3">
              {socialIcons.map((Icon, index) => (
                <a key={index} href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Email</p>
                  <p className="text-slate-400 text-sm">eee@sec.ac.bd</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Phone</p>
                  <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Address</p>
                  <p className="text-slate-400 text-sm">
                    Sylhet Engineering College
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Office Hours</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Monday - Friday</span>
                <span className="text-white">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Saturday</span>
                <span className="text-white">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sunday</span>
                <span className="text-slate-500">Closed</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-400 mb-2">Emergency Contact</p>
              <p className="text-white font-medium text-sm">+1 (555) 999-0000</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 Department of EEE Management System. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white text-xs transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
