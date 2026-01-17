import { useState, useEffect, useCallback } from 'react'
import { DdevProject, TerminalOutput } from './types/electron'
import { ProjectList } from './components/ProjectList'
import { Header } from './components/Header'
import { ProjectDetails } from './components/ProjectDetails'
import { Loader2 } from 'lucide-react'

function App() {
  const [projects, setProjects] = useState<DdevProject[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingProject, setLoadingProject] = useState<string | null>(null)
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([])

  const fetchProjects = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        // Development mode without Electron
        setProjects([])
        setLoading(false)
        return
      }

      const response = await window.electronAPI.ddev.list()
      if (response.success && response.data) {
        setProjects(response.data)
        setError(null)
      } else {
        setError(response.error || 'Failed to fetch projects')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchProjects, 30000)
    return () => clearInterval(interval)
  }, [fetchProjects])

  useEffect(() => {
    if (!selectedProject || !window.electronAPI) {
      setTerminalOutputs([])
      return
    }

    const fetchTerminalOutputs = async () => {
      try {
        const response = await window.electronAPI.terminal.getOutput(selectedProject)
        if (response.success && response.data) {
          setTerminalOutputs(response.data)
        } else {
          setTerminalOutputs([])
        }
      } catch (err) {
        console.error('Failed to fetch terminal outputs:', err)
        setTerminalOutputs([])
      }
    }

    fetchTerminalOutputs()
  }, [selectedProject])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchProjects()
  }

  const handlePoweroff = async () => {
    if (!window.electronAPI) return

    try {
      setRefreshing(true)
      await window.electronAPI.ddev.poweroff()
      await fetchProjects()
    } catch (err) {
      setError((err as Error).message)
      setRefreshing(false)
    }
  }

  const handleAction = async (action: 'start' | 'stop' | 'restart', projectName: string) => {
    if (!window.electronAPI || loadingProject) return

    setLoadingProject(projectName)
    try {
      await window.electronAPI.ddev[action](projectName)
      await fetchProjects()
      // Refresh terminal outputs after action completes
      if (projectName === selectedProject && window.electronAPI) {
        const response = await window.electronAPI.terminal.getOutput(projectName)
        if (response.success && response.data) {
          setTerminalOutputs(response.data)
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} project:`, err)
    } finally {
      setLoadingProject(null)
    }
  }

  const handleClearTerminal = async () => {
    if (!selectedProject || !window.electronAPI) return

    try {
      await window.electronAPI.terminal.clearOutput(selectedProject)
      setTerminalOutputs([])
    } catch (err) {
      console.error('Failed to clear terminal outputs:', err)
    }
  }

  const selectedProjectData = projects.find(p => p.name === selectedProject)

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <Header
        onRefresh={handleRefresh}
        onPoweroff={handlePoweroff}
        refreshing={refreshing}
        projectCount={projects.length}
        runningCount={projects.filter(p => p.status === 'running').length}
      />

      <main className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-ddev-accent mx-auto mb-4" />
              <p className="text-slate-400">Loading DDEV projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                <h2 className="text-red-400 font-semibold mb-2">Error Loading Projects</h2>
                <p className="text-slate-400 text-sm mb-4">{error}</p>
                <p className="text-slate-500 text-xs">
                  Make sure DDEV is installed and accessible from your PATH.
                </p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <div className="w-16 h-16 bg-ddev-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📦</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No Projects Found</h2>
                <p className="text-slate-400 text-sm">
                  No DDEV projects detected. Create a new project using{' '}
                  <code className="bg-slate-700 px-2 py-1 rounded text-ddev-accent">ddev config</code>{' '}
                  in your project directory.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ProjectList
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onAction={handleAction}
              loadingProject={loadingProject}
            />
            <ProjectDetails
              project={selectedProjectData}
              onRefresh={fetchProjects}
              loadingProject={loadingProject}
              onAction={handleAction}
              terminalOutputs={terminalOutputs}
              onClearTerminal={handleClearTerminal}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default App
