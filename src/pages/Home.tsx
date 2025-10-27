import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Package, Shield, Database, Network, ChevronRight, Layers, Wand2 } from "lucide-react";

const apps = [
  {
    id: "airgap-deploy",
    name: "AirGap Deploy",
    description: "Secure air-gapped deployment portal for managing artifacts, helm charts, and docker images",
    icon: Package,
    to: "/airgap-deploy",
    gradient: "from-primary/20 to-primary/5",
    available: true,
  },
  {
    id: "airgap-wizard",
    name: "Air Gapped Deployment Wizard",
    description: "Guided wizard to mirror and download artifacts from our registries for air-gapped deployments",
    icon: Wand2,
    to: "/airgap-wizard",
    gradient: "from-primary/20 to-primary/5",
    available: true,
  },
  {
    id: "security-hub",
    name: "Security Hub",
    description: "Centralized security monitoring and threat detection across your infrastructure",
    icon: Shield,
    to: "/security-hub",
    gradient: "from-chart-2/20 to-chart-2/5",
    available: false,
  },
  {
    id: "data-nexus",
    name: "Data Nexus",
    description: "Enterprise data integration and management platform for distributed systems",
    icon: Database,
    to: "/data-nexus",
    gradient: "from-chart-3/20 to-chart-3/5",
    available: false,
  },
  {
    id: "network-ops",
    name: "Network Ops",
    description: "Real-time network operations and infrastructure monitoring dashboard",
    icon: Network,
    to: "/network-ops",
    gradient: "from-chart-4/20 to-chart-4/5",
    available: false,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Layers className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Enterprise Portal</h1>
                <p className="text-xs text-muted-foreground">Secure Operations Platform</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-muted-foreground backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              All Systems Operational
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Unified Operations
              <span className="block text-primary mt-2">Command Center</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access mission-critical applications and infrastructure management tools from a single, secure platform designed for enterprise operations.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="gap-2 group">
                Get Started
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-foreground mb-2">Applications</h3>
          <p className="text-muted-foreground">Select an application to access specialized tools and dashboards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {apps.map((app) => {
            const Icon = app.icon;
            const cardContent = (
              <Card className={`h-full transition-all duration-300 hover:shadow-lg border-border ${
                app.available ? 'hover:scale-[1.02] hover:border-primary/50' : 'opacity-60'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center border border-border`}>
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    {!app.available && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                    {app.available && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                  <CardTitle className="text-xl text-foreground">{app.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full ${app.available ? 'bg-success' : 'bg-muted'}`} />
                    {app.available ? 'Available' : 'In Development'}
                  </div>
                </CardContent>
              </Card>
            );

            return app.available ? (
              <Link key={app.id} to={app.to}>
                {cardContent}
              </Link>
            ) : (
              <div key={app.id} className="cursor-not-allowed">
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 Enterprise Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
