import { useState } from "react";
import { ArtifactCard } from "@/components/ArtifactCard";
import { DeploymentStats } from "@/components/DeploymentStats";
import { SecurityDashboard } from "@/components/SecurityDashboard";
import { TransferStatus } from "@/components/TransferStatus";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Filter } from "lucide-react";

const mockArtifacts = [
  {
    id: "1",
    name: "app-backend-service",
    version: "2.4.1",
    type: "helm" as const,
    size: "245 MB",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    signature: "verified",
    sbom: "included",
    provenance: "included",
    lastUpdated: "2 hours ago",
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 2,
    },
    cosignVerified: true,
  },
  {
    id: "2",
    name: "frontend-app",
    version: "1.8.3",
    type: "docker" as const,
    size: "512 MB",
    sha256: "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a",
    signature: "verified",
    sbom: "included",
    lastUpdated: "5 hours ago",
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    },
    cosignVerified: true,
  },
  {
    id: "3",
    name: "database-operator",
    version: "3.1.0",
    type: "helm" as const,
    size: "128 MB",
    sha256: "cd2662154e6d76b2b6b4b9e0a3d0d6d8ed7b3c1c8c7e8b4a6c2a3d4f5a6b7c8d",
    signature: "verified",
    sbom: "included",
    provenance: "included",
    lastUpdated: "1 day ago",
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 1,
    },
    cosignVerified: true,
  },
  {
    id: "4",
    name: "api-gateway",
    version: "4.2.0",
    type: "docker" as const,
    size: "384 MB",
    sha256: "f9e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
    signature: "verified",
    sbom: "included",
    lastUpdated: "1 day ago",
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 1,
      low: 1,
    },
    cosignVerified: true,
  },
  {
    id: "5",
    name: "monitoring-stack",
    version: "5.0.2",
    type: "helm" as const,
    size: "892 MB",
    sha256: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    signature: "verified",
    sbom: "included",
    provenance: "included",
    lastUpdated: "3 days ago",
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 1,
    },
    cosignVerified: true,
  },
  {
    id: "6",
    name: "data-processor",
    version: "2.1.5",
    type: "docker" as const,
    size: "675 MB",
    sha256: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    signature: "verified",
    sbom: "included",
    lastUpdated: "3 days ago",
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    cosignVerified: true,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "helm" | "docker">("all");

  const filteredArtifacts = mockArtifacts.filter((artifact) => {
    const matchesSearch = artifact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || artifact.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AirGap Deploy</h1>
                <p className="text-xs text-muted-foreground">Air-Gapped Deployment Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <DeploymentStats />
        <SecurityDashboard />
        <TransferStatus />

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <TabsList>
            <TabsTrigger value="all">All Artifacts</TabsTrigger>
            <TabsTrigger value="helm">Helm Charts</TabsTrigger>
            <TabsTrigger value="docker">Docker Images</TabsTrigger>
          </TabsList>

          <TabsContent value={filterType} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtifacts.map((artifact) => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </div>

            {filteredArtifacts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No artifacts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
