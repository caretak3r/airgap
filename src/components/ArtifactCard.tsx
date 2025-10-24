import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Shield, FileCheck, Package } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
}

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

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
    <Card className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{artifact.name}</h3>
            <p className="text-sm text-muted-foreground">Version {artifact.version}</p>
          </div>
        </div>
        <Badge variant={artifact.type === "helm" ? "default" : "secondary"}>
          {artifact.type === "helm" ? "Helm Chart" : "Docker Image"}
        </Badge>
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
        <Badge variant="outline" className="text-xs">
          <FileCheck className="w-3 h-3 mr-1" />
          SBOM
        </Badge>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Signature
        </Badge>
        {artifact.provenance && (
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Provenance
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
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Last updated: {artifact.lastUpdated}
      </p>
    </Card>
  );
}
