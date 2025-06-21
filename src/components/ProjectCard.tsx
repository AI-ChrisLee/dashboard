'use client'

import { Calendar, Users, Clock } from 'lucide-react'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-4 sm:p-6 hover:border-gray-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          {project.title}
        </h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)} self-start sm:self-auto`}>
          {project.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Progress</span>
          <span className="text-xs sm:text-sm text-gray-500">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Project details */}
      <div className="space-y-2">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span>{project.teamSize} team members</span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Team avatars */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex -space-x-1 sm:-space-x-2">
          {project.team.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
            >
              {member.charAt(0)}
            </div>
          ))}
          {project.team.length > 3 && (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
              +{project.team.length - 3}
            </div>
          )}
        </div>
        
        <button className="text-indigo-600 text-xs sm:text-sm font-medium hover:text-indigo-500">
          View Details
        </button>
      </div>
    </div>
  )
} 