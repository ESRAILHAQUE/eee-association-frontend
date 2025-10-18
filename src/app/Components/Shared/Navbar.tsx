'use client'

import { Menu, X, Zap } from 'lucide-react'

interface NavbarProps {
  isMenuOpen: boolean
  toggleMenu: () => void
}

export default function Navbar({ isMenuOpen, toggleMenu }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-slate-800">EEE Association</span>
              <p className="text-xs text-slate-600 -mt-1">Sylhet Engineering College</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Home</a>
            <a href="#about" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">About</a>
            <a href="#features" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#events" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Events</a>
            <a href="#achievements" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Achievements</a>
            <a href="#contact" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Contact</a>
            <button className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Login</button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Register</button>
          </div>
          
          {/* Mobile menu button */}
          <button className="lg:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">Home</a>
              <a href="#about" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">About</a>
              <a href="#features" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">Features</a>
              <a href="#events" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">Events</a>
              <a href="#achievements" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">Achievements</a>
              <a href="#contact" className="text-slate-700 hover:text-slate-900 transition-colors px-2 py-1">Contact</a>
              <div className="flex space-x-4 pt-4">
                <button className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Login</button>
                <button className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Register</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
