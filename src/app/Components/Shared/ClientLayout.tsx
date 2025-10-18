'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className='min-h-screen bg-slate-50 flex flex-col'>
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <main id="main-content" className='flex-grow'>
        {children}
      </main>
      <Footer />
    </div>
  )
}

