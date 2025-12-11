import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Shield, FileCheck, Package, AlertTriangle, Lock, Eye, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SBOMDialog } from "@/components/SBOMDialog";
import { ArtifactInspector } from "@/components/ArtifactInspector";

interface Artifact {
  id: string;
  name: string;
  version: string;
  type: "helm" | "docker";
  size: string;
  sha256: string;
  signature: string;
  sbom: string;
  provenance?: string;
  lastUpdated: string;
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  cosignVerified?: boolean;
}

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const [downloading, setDownloading] = useState(false);
  const [sbomOpen, setSbomOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const { toast } = useToast();

  const totalVulnerabilities = artifact.vulnerabilities
    ? Object.values(artifact.vulnerabilities).reduce((a, b) => a + b, 0)
    : 0;

  const handleDownload = async () => {
    setDownloading(true);
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Download Package Ready",
      description: `${artifact.name} v${artifact.version} with all verification files prepared for air-gapped deployment.`,
    });
    
    setDownloading(false);
  };

  return (
    <>
      <Card className="group p-6 hover:shadow-lg transition-all duration-300 border-border bg-card hover:border-primary/50 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{artifact.name}</h3>
              <p className="text-sm text-muted-foreground">Version {artifact.version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInspectorOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Inspect Artifact"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Badge variant={artifact.type === "helm" ? "default" : "secondary"}>
              {artifact.type === "helm" ? "Helm Chart" : "Docker Image"}
            </Badge>
          </div>
        </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <FileCheck className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">Size:</span>
          <span className="text-card-foreground font-medium">{artifact.size}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">SHA-256:</span>
          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
            {artifact.sha256.substring(0, 16)}...
          </code>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge 
          variant="outline" 
          className="text-xs bg-success/10 text-success border-success/20 cursor-pointer hover:bg-success/20"
          onClick={() => setSbomOpen(true)}
        >
          <FileCheck className="w-3 h-3 mr-1" />
          SBOM
        </Badge>
        <Badge 
          variant="outline" 
          className={`text-xs ${
            artifact.cosignVerified
              ? "bg-success/10 text-success border-success/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Lock className="w-3 h-3 mr-1" />
          Cosign
        </Badge>
        {artifact.provenance && (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
            <Shield className="w-3 h-3 mr-1" />
            Provenance
          </Badge>
        )}
        {totalVulnerabilities > 0 && (
          <Badge 
            variant="outline" 
            className={`text-xs ${
              artifact.vulnerabilities?.critical || artifact.vulnerabilities?.high
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-warning/10 text-warning border-warning/20"
            }`}
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            {totalVulnerabilities} issues
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {downloading ? "Preparing..." : "Download Bundle"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSbomOpen(true)}
          title="View SBOM"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Last updated: {artifact.lastUpdated}
      </p>

      <SBOMDialog 
        open={sbomOpen} 
        onOpenChange={setSbomOpen}
        artifact={{ name: artifact.name, version: artifact.version }}
      />
    </Card>

    <ArtifactInspector
      isOpen={inspectorOpen}
      onClose={() => setInspectorOpen(false)}
      artifact={artifact}
    />
    </>
  );
}
