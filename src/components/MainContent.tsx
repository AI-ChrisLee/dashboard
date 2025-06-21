'use client'

import ProjectCard from './ProjectCard'
import { mockProjects } from '@/data/mockData'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Target } from 'lucide-react'

export default function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[85rem] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Report Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive analytics and project insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                Export Report
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Custom Report
              </button>
            </div>
          </div>
        </div>

        {/* Project Progress Report - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Project Progress Report</h3>
                <p className="text-xs sm:text-sm text-gray-500">Active projects by development stage</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Year</button>
              <button className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md">Month</button>
              <button className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Week</button>
              <button className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Custom</button>
            </div>
          </div>
          
          {/* Stacked Bar Chart */}
          <div className="relative h-48 sm:h-64 lg:h-80">
            <div className="flex items-end justify-between h-full space-x-2 sm:space-x-4 lg:space-x-8">
              {['Planning', 'Development', 'Testing', 'Review', 'Deployment'].map((stage, index) => (
                <div key={stage} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-100 rounded-t-lg relative transition-all duration-300 hover:scale-105" style={{ height: `${100 + index * 15}px` }}>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500 hover:from-blue-600 hover:to-blue-500" style={{ height: '40%' }}></div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-sm transition-all duration-500 hover:from-green-600 hover:to-green-500" style={{ height: '25%', bottom: '40%' }}></div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-sm transition-all duration-500 hover:from-yellow-600 hover:to-yellow-500" style={{ height: '20%', bottom: '65%' }}></div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm transition-all duration-500 hover:from-purple-600 hover:to-purple-500" style={{ height: '15%', bottom: '85%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center truncate">{stage}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mb-6 sm:mb-8 lg:h-[420px]">
                     {/* Monthly Trends */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:h-full lg:flex lg:flex-col">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Monthly Project Completion</h3>
                <p className="text-xs sm:text-sm text-gray-500">Showing trends and seasonality in project delivery</p>
              </div>
            </div>
            
                          {/* Line Chart Area */}
              <div className="relative lg:flex-1 lg:h-auto lg:min-h-[250px]">
                <div className="h-48 sm:h-64 lg:h-full">
                  <svg className="w-full h-full" viewBox="0 0 400 180">
                    {/* Grid Lines */}
                    <defs>
                      <pattern id="grid" width="40" height="18" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 18" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Main Line */}
                    <path
                      d="M 20 130 Q 60 100 100 120 T 180 80 T 260 60 T 340 70 T 380 65"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="3"
                    />
                    
                    {/* Secondary Line */}
                    <path
                      d="M 20 160 Q 60 150 100 140 T 180 120 T 260 110 T 340 100 T 380 95"
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="2"
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                
                {/* Month Labels - Inside container */}
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 mb-6 sm:mb-8 lg:h-[380px]">
          {/* Funnel Report */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:h-full lg:flex lg:flex-col">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Project Funnel Report</h3>
                <p className="text-xs sm:text-sm text-gray-500">Show the percentage of projects in each stage</p>
              </div>
            </div>
            
            {/* Funnel Visualization */}
            <div className="relative h-48 sm:h-64 lg:flex-1 lg:h-auto lg:min-h-[200px]">
              <div className="flex flex-col items-center space-y-2">
                {[
                  { label: 'Prospecting', width: '100%', color: 'from-yellow-400 to-yellow-500', percentage: '100%' },
                  { label: 'Initial Contact', width: '85%', color: 'from-orange-400 to-orange-500', percentage: '75%' },
                  { label: 'Proposal', width: '70%', color: 'from-red-400 to-red-500', percentage: '50%' },
                  { label: 'Negotiation', width: '55%', color: 'from-pink-400 to-pink-500', percentage: '25%' }
                ].map((stage, index) => (
                  <div key={stage.label} className="relative w-full flex items-center">
                    <div className="flex-1 flex items-center">
                      <div 
                        className={`h-12 bg-gradient-to-r ${stage.color} rounded-lg flex items-center justify-center text-white font-medium text-sm shadow-lg transition-all duration-300 hover:shadow-xl`}
                        style={{ width: stage.width }}
                      >
                        {stage.label}
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-gray-600 w-12 text-center">
                      {stage.percentage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue/Budget Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:h-full lg:flex lg:flex-col">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Budget Distribution by Priority</h3>
                <p className="text-xs sm:text-sm text-gray-500">Resource allocation across different priority levels</p>
              </div>
            </div>
            
                        {/* Donut Chart */}
            <div className="relative lg:flex-1 lg:h-auto lg:min-h-[200px] lg:flex lg:items-center">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center">
                <div className="relative mx-auto lg:mx-0">
                  <svg className="w-40 h-40 sm:w-[200px] sm:h-[200px] transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="20"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray="125.6 377"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="20"
                      strokeDasharray="94.2 408.4"
                      strokeDashoffset="-125.6"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeDasharray="75.4 427.2"
                      strokeDashoffset="-219.8"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="20"
                      strokeDasharray="56.5 446.1"
                      strokeDashoffset="-295.2"
                    />
                  </svg>
                
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-500 mb-1">Total Budget</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">$760K</div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="lg:ml-8 mt-4 lg:mt-0">
                  <div className="grid grid-cols-2 gap-2 lg:block lg:space-y-2 text-xs lg:text-sm">
                    <div className="flex items-center whitespace-nowrap">
                      <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                      <span>High Priority</span>
                    </div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                      <span>Medium Priority</span>
                    </div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                      <span>Low Priority</span>
                    </div>
                    <div className="flex items-center whitespace-nowrap">
                      <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                      <span>Planning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
                              <div>
                  <p className="text-blue-100 text-xs sm:text-sm">Total Projects</p>
                  <p className="text-2xl sm:text-3xl font-bold">{mockProjects.length}</p>
                  <p className="text-blue-200 text-xs sm:text-sm">Active projects</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {mockProjects.filter(p => p.status === 'Completed').length}
                </p>
                <p className="text-green-200 text-xs sm:text-sm">This quarter</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-xs sm:text-sm">In Progress</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {mockProjects.filter(p => p.status === 'In Progress').length}
                </p>
                <p className="text-yellow-200 text-xs sm:text-sm">Active now</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm">Team Members</p>
                <p className="text-2xl sm:text-3xl font-bold">24</p>
                <p className="text-purple-200 text-xs sm:text-sm">Across all projects</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 