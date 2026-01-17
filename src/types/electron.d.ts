export interface DdevProject {
  name: string
  status: string
  type: string
  approot: string
  docroot: string
  httpurl: string
  httpsurl: string
  mailhog_url?: string
  mailpit_url?: string
  phpmyadmin_url?: string
  router_status?: string
  shortroot?: string
  mutagen_enabled?: boolean
}

export interface DdevDescribeResponse {
  name: string
  status: string
  approot: string
  docroot: string
  type: string
  httpurl: string
  httpsurl: string
  urls?: string[]
  mailhog_url?: string
  mailpit_url?: string
  phpmyadmin_url?: string
  database?: {
    type: string
    version: string
  }
  webserver_type?: string
  php_version?: string
  nodejs_version?: string
  router_status?: string
  mutagen_enabled?: boolean
  services?: Record<string, {
    exposed_ports?: string
    host_ports?: string
  }>
}

export interface TerminalOutput {
  timestamp: Date
  message: string
  projectName?: string
}

export interface DdevApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ElectronAPI {
  ddev: {
    list: () => Promise<DdevApiResponse<DdevProject[]>>
    describe: (projectName: string) => Promise<DdevApiResponse<DdevDescribeResponse>>
    start: (projectName: string) => Promise<DdevApiResponse<void>>
    stop: (projectName: string) => Promise<DdevApiResponse<void>>
    restart: (projectName: string) => Promise<DdevApiResponse<void>>
    poweroff: () => Promise<DdevApiResponse<void>>
  }
  shell: {
    openExternal: (url: string) => Promise<DdevApiResponse<void>>
  }
  terminal: {
    getOutput: (projectName: string) => Promise<DdevApiResponse<TerminalOutput[]>>
    clearOutput: (projectName: string) => Promise<DdevApiResponse<void>>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
