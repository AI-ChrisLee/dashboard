'use client'

import { 
  Home, 
  FolderOpen, 
  Users, 
  Settings, 
  BarChart3, 
  FileText,
  X 
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const navigation = [
  { name: 'Dashboard', icon: Home, current: false },
  { name: 'Tasks', icon: FileText, current: false },
  { name: 'Emails', icon: Users, current: false },
  { name: 'Reports', icon: BarChart3, current: true },
  { name: 'Automations', icon: Settings, current: false },
]

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">CG</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-gray-900">CustomerGo</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${item.current
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Spaces Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spaces</h3>
              <button className="text-gray-400 hover:text-gray-600">+</button>
            </div>
            <ul className="space-y-1">
              {[
                { name: 'Sales Management', color: 'bg-gray-800', initial: 'S' },
                { name: 'Recruiting', color: 'bg-orange-500', initial: 'R' },
                { name: 'Marketing Campaign', color: 'bg-green-500', initial: 'M' },
                { name: 'Legal Service', color: 'bg-yellow-500', initial: 'L' },
              ].map((space) => (
                <li key={space.name}>
                  <a
                    href="#"
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                  >
                    <div className={`${space.color} w-5 h-5 rounded mr-3 flex items-center justify-center text-white text-xs font-medium`}>
                      {space.initial}
                    </div>
                    {space.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Unlock More Feature */}
        <div className="absolute bottom-20 left-0 right-0 mx-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Unlock More Feature</h4>
            <p className="text-xs text-gray-600 mb-3">Advanced features like enhanced analytics, AI insights, and etc.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mb-3">16/30 days</p>
            <button className="w-full bg-gray-800 text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-gray-700 transition-colors">
              Compare Plan Details
            </button>
          </div>
        </div>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">JD</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <Users className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 