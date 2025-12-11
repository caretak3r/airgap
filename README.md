# Sentinel Air-Gap

A security platform for inspecting and verifying air-gapped deployment bundles. Sentinel provides comprehensive supply chain security analysis for Zarf packages deployed in disconnected environments.

## Features

- **Package Overview** - Dashboard with compliance scores, artifact counts, signature status, and vulnerability summary
- **Chain of Trust Verification** - Visual pipeline showing Build → Bundle → Bridge → Bootstrap verification steps
- **Artifact Explorer** - Inspect container images and Helm charts with detailed metadata, SBOM, signatures, and manifests
- **Vulnerability Management** - CVE tracking with severity filtering and affected resource mapping
- **Compliance Checks** - Policy compliance scoring against ADR-004 and SLSA L3 frameworks

## Live Demo

[https://silent.engineer/airgap/](https://silent.engineer/airgap/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/airgap.git
cd airgap

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Routing**: React Router
- **State**: TanStack Query

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── SentinelLayout.tsx     # Main layout with sidebar
│   ├── ChainOfTrustVisualization.tsx
│   └── ArtifactInspectorDrawer.tsx
├── pages/
│   ├── AirGapDeploy.tsx       # Overview dashboard
│   ├── ArtifactExplorer.tsx   # Artifact list
│   ├── Vulnerabilities.tsx    # CVE management
│   └── Compliance.tsx         # Policy checks
└── App.tsx                    # Routes configuration
```

## Deployment

The project automatically deploys to GitHub Pages on push to `main` branch via the included workflow at `.github/workflows/deploy.yml`.

## License

MIT
