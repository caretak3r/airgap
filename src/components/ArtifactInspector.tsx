import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  X, 
  Shield, 
  FileText, 
  Code2, 
  Package, 
  Bug,
  CheckCircle2,
  AlertTriangle,
  Info,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArtifactInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  artifact: any;
}

interface Vulnerability {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  package: string;
  version: string;
  cve?: string;
}

interface SbomComponent {
  name: string;
  version: string;
  type: string;
  license: string;
  supplier?: string;
}

const mockSbom: SbomComponent[] = [
  { name: "nginx", version: "1.21.0", type: "library", license: "BSD-2-Clause" },
  { name: "openssl", version: "1.1.1k", type: "library", license: "Apache-2.0" },
  { name: "ubuntu", version: "20.04", type: "os", license: "GPL-2.0+" },
  { name: "golang", version: "1.19.5", type: "runtime", license: "BSD-3-Clause" },
];

const mockVulnerabilities: Vulnerability[] = [
  {
    id: "CVE-2023-1234",
    severity: "critical",
    description: "Buffer overflow in image processing library",
    package: "libpng",
    version: "1.6.37",
    cve: "CVE-2023-1234"
  },
  {
    id: "CVE-2023-5678",
    severity: "medium",
    description: "Information disclosure in logging component",
    package: "log4j",
    version: "2.17.1",
    cve: "CVE-2023-5678"
  }
];

export const ArtifactInspector = ({ isOpen, onClose, artifact }: ArtifactInspectorProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen || !artifact) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: "Copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        description: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Type</span>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-semibold capitalize">{artifact.type}</div>
        </div>
        <div className="p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Size</span>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-semibold">{artifact.size}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Security Status</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm">Signature Verified</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm">Provenance Valid</span>
          </div>
          {artifact.sbom === "included" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm">SBOM Available</span>
            </div>
          )}
        </div>
      </div>

      {artifact.vulnerabilities && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Vulnerability Summary</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-400" />
                <span className="text-sm">Critical</span>
                <span className="ml-auto font-semibold text-rose-400">
                  {artifact.vulnerabilities.critical}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-sm">High</span>
                <span className="ml-auto font-semibold text-orange-400">
                  {artifact.vulnerabilities.high}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Medium</span>
                <span className="ml-auto font-semibold text-yellow-400">
                  {artifact.vulnerabilities.medium}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Low</span>
                <span className="ml-auto font-semibold text-blue-400">
                  {artifact.vulnerabilities.low}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Checksum</h4>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
          <code className="text-xs font-mono flex-1 truncate">{artifact.sha256}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(artifact.sha256)}
            className="shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const SbomTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Software Bill of Materials</h4>
        <div className="space-y-2">
          {mockSbom.map((component, index) => (
            <div key={index} className="p-4 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{component.name}</span>
                    <Badge variant="secondary">{component.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Version: <code className="text-xs bg-muted px-1 rounded">{component.version}</code></div>
                    <div>License: <span className="text-xs">{component.license}</span></div>
                    {component.supplier && (
                      <div>Supplier: <span className="text-xs">{component.supplier}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SignatureTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Digital Signatures</h4>
        <div className="p-4 rounded-lg border border-success/20 bg-success/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-success" />
            <span className="font-medium text-success">Cosign Signature Verified</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div>Signature verified against public key</div>
            <div>Timestamp: 2024-01-15T10:30:00Z</div>
            <div>Signer: defense-app-ci@company.com</div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border border-success/20 bg-success/5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="font-medium text-success">Rekor Transparency Log</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div>Entry ID: 39a7b8c9d0e1f2g3</div>
            <div>Logged at: 2024-01-15T10:31:15Z</div>
            <div>Log ID: a1b2c3d4e5f6g7h8</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Signature Details</h4>
        <div className="p-3 rounded-lg bg-muted border border-border">
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
{`-----BEGIN COSIGN SIGNATURE-----
MEYCIQDG5LZVJYYW7L4YJQ3XN2K7J8H9G0F1E2D3C4B5A6Z7Y8X9W0V1U2T3S4R5Q==
IhANZYXWVUTSRQPONMLKJIHGFEDCBAZYXWVUTSRQPONMLKJIHGFEDCBA
-----END COSIGN SIGNATURE-----`}
          </pre>
        </div>
      </div>
    </div>
  );

  const ManifestTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <h4 className="font-medium text-foreground">Container Manifest</h4>
        {artifact.type === "docker" && (
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Image:</span>
                <div className="font-mono text-sm mt-1">{artifact.name}:latest</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Layers:</span>
                <div className="space-y-1 mt-2">
                  <div className="text-xs font-mono text-muted-foreground">
                    sha256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2...
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    sha256:b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3...
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    sha256:c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {artifact.type === "helm" && (
          <div className="p-4 rounded-lg border border-border">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Chart Information</span>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-sm">
                  <div>Name: {artifact.name}</div>
                  <div>Version: {artifact.version}</div>
                  <div>App Version: 1.0.0</div>
                  <div>API Version: v2</div>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Values</span>
                <pre className="text-xs font-mono text-muted-foreground mt-2 p-2 rounded bg-muted">
{`image:
  repository: nginx
  tag: "1.21.0"
service:
  type: ClusterIP
  port: 80
resources:
  limits:
    cpu: 100m
    memory: 128Mi`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-y-0 right-0 w-[600px] bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-40 transform transition-transform duration-300 flex flex-col ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}>
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
            {artifact.type === "docker" ? (
              <Package className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Code2 className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-foreground truncate">{artifact.name}</h2>
            <p className="text-xs text-muted-foreground font-mono truncate">
              sha256:{artifact.sha256.slice(0, 12)}...
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card/50 px-6 gap-6">
        <button
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "sbom"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
          onClick={() => setActiveTab("sbom")}
        >
          SBOM
        </button>
        <button
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "signature"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
          onClick={() => setActiveTab("signature")}
        >
          Signature
        </button>
        <button
          className={`py-3 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "manifest"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
          onClick={() => setActiveTab("manifest")}
        >
          Manifest
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "sbom" && <SbomTab />}
        {activeTab === "signature" && <SignatureTab />}
        {activeTab === "manifest" && <ManifestTab />}
      </ScrollArea>
    </div>
  );
};
