import { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { TerminalOutput } from '../types/electron'

interface TerminalProps {
  outputs: TerminalOutput[]
  onClear?: () => void
  projectName?: string
}

export function Terminal({ outputs, onClear, projectName }: TerminalProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current && !isCollapsed) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [outputs, isCollapsed])

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className="bg-slate-900 border-t border-slate-700 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-5 h-5 text-ddev-accent" />
          <h3 className="text-sm font-semibold text-white">Terminal Output</h3>
          {projectName && (
            <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
              {projectName}
            </span>
          )}
          <span className="text-xs text-slate-500">
            {outputs.length} line{outputs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onClear && outputs.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              title="Clear output"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm min-h-[200px] max-h-[400px]"
        >
          {outputs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              <span className="text-sm">No output yet</span>
            </div>
          ) : (
            <div className="space-y-1">
              {outputs.map((output, index) => (
                <div key={index} className="flex gap-3 group">
                  <span className="text-slate-600 text-xs flex-shrink-0 select-none">
                    {formatTimestamp(output.timestamp)}
                  </span>
                  <span className="text-slate-300 whitespace-pre-wrap break-all flex-1">
                    {output.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
