import { DdevProject } from '../types/electron'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  projects: DdevProject[]
  selectedProject: string | null
  onSelectProject: (name: string) => void
  onAction: (action: 'start' | 'stop' | 'restart', projectName: string) => Promise<void>
  loadingProject: string | null
}

export function ProjectList({ projects, selectedProject, onSelectProject, onAction, loadingProject }: ProjectListProps) {
  return (
    <aside className="w-80 bg-slate-800/30 border-r border-slate-700 overflow-y-auto h-full">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Projects
        </h2>
        <div className="space-y-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              isSelected={selectedProject === project.name}
              onSelect={() => onSelectProject(project.name)}
              onAction={onAction}
              loadingProject={loadingProject}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
