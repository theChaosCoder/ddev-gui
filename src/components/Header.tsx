import { RefreshCw, Power, Server } from 'lucide-react'

interface HeaderProps {
  onRefresh: () => void
  onPoweroff: () => void
  refreshing: boolean
  projectCount: number
  runningCount: number
}

export function Header({ onRefresh, onPoweroff, refreshing, projectCount, runningCount }: HeaderProps) {
  return (
    <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4 titlebar-drag-region">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ddev-primary to-ddev-accent rounded-xl flex items-center justify-center shadow-lg shadow-ddev-primary/20">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DDEV GUI</h1>
              <p className="text-xs text-slate-400">Local Development Manager</p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 ml-6 titlebar-no-drag">
            <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-full">
              <Server className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">{projectCount} projects</span>
            </div>
            {runningCount > 0 && (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">{runningCount} running</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 titlebar-no-drag">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-lg transition-colors"
            title="Refresh projects"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          <button
            onClick={onPoweroff}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 rounded-lg transition-colors"
            title="Stop all projects"
          >
            <Power className="w-4 h-4" />
            <span className="text-sm">Power Off All</span>
          </button>
        </div>
      </div>
    </header>
  )
}
