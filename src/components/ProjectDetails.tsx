import { useState, useEffect } from 'react'
import { DdevProject, DdevDescribeResponse, TerminalOutput } from '../types/electron'
import {
  ExternalLink,
  Database,
  Globe,
  Server,
  Mail,
  Folder,
  Code,
  Loader2,
  Play,
  Square,
  RotateCcw
} from 'lucide-react'
import { Terminal } from './Terminal'

interface ProjectDetailsProps {
  project: DdevProject | undefined
  onRefresh: () => void
  loadingProject: string | null
  onAction: (action: 'start' | 'stop' | 'restart', projectName: string) => void
  terminalOutputs?: TerminalOutput[]
  onClearTerminal?: () => void
}

export function ProjectDetails({ project, onRefresh: _onRefresh, loadingProject, onAction, terminalOutputs, onClearTerminal }: ProjectDetailsProps) {
  const [details, setDetails] = useState<DdevDescribeResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!project || !window.electronAPI) {
      setDetails(null)
      return
    }

    const fetchDetails = async () => {
      setLoading(true)
      try {
        const response = await window.electronAPI.ddev.describe(project.name)
        if (response.success && response.data) {
          setDetails(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch project details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [project?.name])

  const openUrl = async (url: string) => {
    if (window.electronAPI) {
      await window.electronAPI.shell.openExternal(url)
    } else {
      window.open(url, '_blank')
    }
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900/50">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Server className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-500">Select a project to view details</p>
        </div>
      </div>
    )
  }

  const isRunning = project.status === 'running'
  const isStopped = project.status === 'stopped'

  // Collect all available URLs
  const urls: { label: string; url: string; icon: typeof Globe }[] = []

  if (isRunning) {
    if (details?.httpsurl || project.httpsurl) {
      urls.push({ label: 'Website (HTTPS)', url: details?.httpsurl || project.httpsurl, icon: Globe })
    }
    if (details?.httpurl || project.httpurl) {
      urls.push({ label: 'Website (HTTP)', url: details?.httpurl || project.httpurl, icon: Globe })
    }
    if (details?.phpmyadmin_url || project.phpmyadmin_url) {
      urls.push({ label: 'phpMyAdmin', url: details?.phpmyadmin_url || project.phpmyadmin_url!, icon: Database })
    }
    if (details?.mailpit_url || project.mailpit_url) {
      urls.push({ label: 'Mailpit', url: details?.mailpit_url || project.mailpit_url!, icon: Mail })
    }
    if (details?.mailhog_url || project.mailhog_url) {
      urls.push({ label: 'MailHog', url: details?.mailhog_url || project.mailhog_url!, icon: Mail })
    }
    // Add any additional URLs from describe
    if (details?.urls) {
      details.urls.forEach((url) => {
        if (!urls.some(u => u.url === url)) {
          urls.push({ label: url, url, icon: ExternalLink })
        }
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-ddev-accent" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                  <div
                    className={`
                      flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                      ${isRunning ? 'bg-green-500/20 text-green-400' : ''}
                      ${isStopped ? 'bg-slate-600/50 text-slate-400' : ''}
                      ${!isRunning && !isStopped ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    `}
                  >
                    <div
                      className={`
                        w-2 h-2 rounded-full
                        ${isRunning ? 'bg-green-500 animate-pulse' : ''}
                        ${isStopped ? 'bg-slate-500' : ''}
                        ${!isRunning && !isStopped ? 'bg-yellow-500 animate-pulse' : ''}
                      `}
                    />
                    {project.status}
                  </div>
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  {project.approot}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                {isStopped ? (
                  <button
                    onClick={() => onAction('start', project.name)}
                    disabled={loadingProject === project.name}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                  >
                    {loadingProject === project.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Start Project
                  </button>
                ) : isRunning ? (
                  <>
                    <button
                      onClick={() => onAction('restart', project.name)}
                      disabled={loadingProject === project.name}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      {loadingProject === project.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      Restart
                    </button>
                    <button
                      onClick={() => onAction('stop', project.name)}
                      disabled={loadingProject === project.name}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
                    >
                      {loadingProject === project.name ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      Stop Project
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onAction('restart', project.name)}
                    disabled={loadingProject === project.name}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 text-yellow-400 rounded-lg transition-colors font-medium"
                  >
                    {loadingProject === project.name ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Restart
                  </button>
                )}
              </div>
            </div>

            {/* Project type */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                <Code className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">Type: {project.type}</span>
              </div>
              {details?.php_version && (
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-slate-300">PHP {details.php_version}</span>
                </div>
              )}
              {details?.nodejs_version && (
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                  <span className="text-sm text-slate-300">Node.js {details.nodejs_version}</span>
                </div>
              )}
              {details?.database && (
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    {details.database.type} {details.database.version}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Project Links */}
          {urls.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-ddev-accent" />
                Project Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {urls.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={index}
                      onClick={() => openUrl(item.url)}
                      className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors text-left group"
                    >
                      <div className="w-10 h-10 bg-ddev-primary/20 rounded-lg flex items-center justify-center group-hover:bg-ddev-primary/30 transition-colors">
                        <Icon className="w-5 h-5 text-ddev-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.label}</p>
                        <p className="text-xs text-slate-400 truncate">{item.url}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-ddev-accent transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Project Info */}
          {details && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-ddev-accent" />
                Project Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Document Root" value={details.docroot || project.docroot} />
                <InfoItem label="Webserver" value={details.webserver_type || 'nginx-fpm'} />
                <InfoItem label="Router Status" value={details.router_status || project.router_status || 'N/A'} />
                <InfoItem
                  label="Mutagen"
                  value={details.mutagen_enabled || project.mutagen_enabled ? 'Enabled' : 'Disabled'}
                />
              </div>
            </div>
          )}

          {/* Stopped state message */}
          {isStopped && (
            <div className="bg-slate-800/30 border border-dashed border-slate-600 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Project is Stopped</h3>
              <p className="text-slate-500 text-sm mb-4">
                Start the project to access URLs and view detailed information.
              </p>
              <button
                onClick={() => onAction('start', project.name)}
                disabled={loadingProject === project.name}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
              >
                {loadingProject === project.name ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                Start Project
              </button>
            </div>
          )}
        </div>
      )}
      </div>

      {project && terminalOutputs && onClearTerminal && (
        <Terminal
          outputs={terminalOutputs}
          onClear={onClearTerminal}
          projectName={project.name}
        />
      )}
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/30 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm text-white truncate" title={value}>{value}</p>
    </div>
  )
}
