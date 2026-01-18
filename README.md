# DDEV GUI

A modern desktop application for managing DDEV projects, built with React, Electron, and Vite.
<img width="1483" height="938" alt="ddev-gui" src="https://github.com/user-attachments/assets/2890b9c8-2ad6-47ed-a4e6-9769635e096c" />

## Features

- **Project Overview**: View all your DDEV projects at a glance
- **Status Monitoring**: Real-time status indicators for running projects
- **Project Controls**: Start, stop, and restart projects with a single click
- **Quick Links**: Direct access to project URLs (website, phpMyAdmin, Mailpit, etc.)
- **Project Details**: View configuration details for each project
- **Power Off All**: Stop all running projects at once

## Development

### Prerequisites

- Node.js 18+
- DDEV installed and configured
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers (for testing)
npx playwright install chromium
```

### Running in Development

```bash
# Start Vite dev server (browser only, without Electron)
npm run dev

# Start with Electron
npm run electron:dev
```

### Building

```bash
# Build for production
npm run build
```

This will create:
- `dist/` - Web assets
- `dist-electron/` - Electron main process
- `release/` - Packaged application

### Testing

```bash
# Run Playwright tests
npm run test

# Run tests with UI
npm run test:ui
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Electron** - Desktop application framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Playwright** - E2E testing

## Project Structure

```
ddev-gui/
├── electron/           # Electron main process
│   ├── main.ts        # Main entry point
│   └── preload.ts     # Preload script for IPC
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
├── tests/             # Playwright tests
└── public/            # Static assets
```

## License

MIT
