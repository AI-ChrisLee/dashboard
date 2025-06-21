'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MainContent from './MainContent'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <MainContent />
      </div>
    </div>
  )
}