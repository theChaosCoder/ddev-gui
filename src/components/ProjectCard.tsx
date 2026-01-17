import { DdevProject } from '../types/electron'
import { Play, Square, RotateCcw, Loader2 } from 'lucide-react'

interface ProjectCardProps {
  project: DdevProject
  isSelected: boolean
  onSelect: () => void
  onAction: (action: 'start' | 'stop' | 'restart', projectName: string) => Promise<void>
  loadingProject: string | null
}

export function ProjectCard({ project, isSelected, onSelect, onAction, loadingProject }: ProjectCardProps) {
  const isRunning = project.status === 'running'
  const isStopped = project.status === 'stopped'

  const isLoading = loadingProject === project.name

  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all duration-200
        ${isSelected
          ? 'bg-ddev-primary/20 border-2 border-ddev-primary shadow-lg shadow-ddev-primary/10'
          : 'bg-slate-800/50 border-2 border-transparent hover:bg-slate-700/50 hover:border-slate-600'
        }
      `}
    >
      {/* Status indicator */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`
              w-3 h-3 rounded-full
              ${isRunning ? 'bg-green-500 shadow-lg shadow-green-500/50' : ''}
              ${isStopped ? 'bg-slate-500' : ''}
              ${!isRunning && !isStopped ? 'bg-yellow-500 animate-pulse' : ''}
            `}
          />
          <span className="text-xs font-medium text-slate-400 uppercase">
            {project.status}
          </span>
        </div>
        <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">
          {project.type}
        </span>
      </div>

      {/* Project name */}
      <h3 className="text-lg font-semibold text-white mb-1 truncate">
        {project.name}
      </h3>

      {/* Project path (shortened) */}
      <p className="text-xs text-slate-500 truncate mb-3" title={project.approot}>
        {project.shortroot || project.approot}
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        {isStopped ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction('start', project.name)
            }}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 text-green-400 rounded-lg transition-colors text-sm font-medium"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Start
          </button>
        ) : isRunning ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('stop', project.name)
              }}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded-lg transition-colors text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              Stop
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAction('restart', project.name)
              }}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-600/50 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded-lg transition-colors text-sm"
              title="Restart"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
            </button>
          </>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction('restart', project.name)
            }}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 text-yellow-400 rounded-lg transition-colors text-sm font-medium"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Restart
          </button>
        )}
      </div>
    </div>
  )
}
