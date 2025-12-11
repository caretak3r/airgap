import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Hammer, 
  Package, 
  Inbox, 
  Rocket,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Terminal,
  Circle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrustStep {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "pending" | "verifying" | "verified" | "failed";
  terminalLogs: string[];
}

interface TerminalLine {
  text: string;
  type: "info" | "success" | "error" | "command" | "output";
  timestamp: string;
}

export const ChainOfTrustVisualization = () => {
  const { toast } = useToast();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [steps, setSteps] = useState<TrustStep[]>([
    {
      id: "build",
      name: "Build",
      description: "CI Pipeline",
      icon: Hammer,
      status: "pending",
      terminalLogs: [
        "$ zarf package inspect build-artifacts.tar.zst",
        "Checking build signature...",
        "Verifying CI pipeline attestation...",
        "Build hash: sha256:a3f8e2d1c4b5...",
        "Signature verified against keyring",
        "Build provenance: GitHub Actions",
        "Build step verified successfully"
      ]
    },
    {
      id: "bundle",
      name: "Bundle",
      description: "Zarf Package",
      icon: Package,
      status: "pending",
      terminalLogs: [
        "$ zarf package verify bundle.tar.zst",
        "Extracting package manifest...",
        "Validating SBOM integrity...",
        "Components found: 12",
        "Checking cosign signatures...",
        "All images signed and verified",
        "Bundle integrity confirmed"
      ]
    },
    {
      id: "bridge",
      name: "Bridge",
      description: "Air-Gap Transfer",
      icon: Inbox,
      status: "pending",
      terminalLogs: [
        "$ zarf package verify-transfer",
        "Calculating transfer checksums...",
        "Source hash: sha256:b4c7d8e9f0a1...",
        "Target hash: sha256:b4c7d8e9f0a1...",
        "Checksums match - no tampering detected",
        "Transfer chain validated",
        "Air-gap bridge verified"
      ]
    },
    {
      id: "bootstrap",
      name: "Bootstrap",
      description: "Cluster Init",
      icon: Rocket,
      status: "pending",
      terminalLogs: [
        "$ zarf init --verify",
        "Connecting to cluster...",
        "Verifying init package signatures...",
        "Deploying Zarf agent...",
        "Configuring image registry...",
        "All components deployed successfully",
        "Cluster bootstrap complete"
      ]
    }
  ]);

  const addTerminalLine = (text: string, type: TerminalLine["type"]) => {
    const timestamp = new Date().toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });
    setTerminalLines(prev => [...prev, { text, type, timestamp }]);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const runVerification = async () => {
    setIsVerifying(true);
    setIsComplete(false);
    setTerminalLines([]);
    
    setSteps(prev => prev.map(step => ({ ...step, status: "pending" })));
    
    addTerminalLine("Initializing chain of trust verification...", "info");
    addTerminalLine("", "info");
    
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "verifying" } : s
      ));
      
      addTerminalLine(`[${step.name.toUpperCase()}] Starting verification...`, "info");
      
      for (const log of step.terminalLogs) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const type: TerminalLine["type"] = log.startsWith("$") ? "command" : "output";
        addTerminalLine(log, type);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = Math.random() > 0.05;
      
      if (success) {
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "verified" } : s
        ));
        addTerminalLine(`[${step.name.toUpperCase()}] ✓ Verification successful`, "success");
      } else {
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "failed" } : s
        ));
        addTerminalLine(`[${step.name.toUpperCase()}] ✗ Verification failed`, "error");
        toast({
          title: "Verification Failed",
          description: `${step.name} verification failed. Please check the logs.`,
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      
      addTerminalLine("", "info");
    }
    
    addTerminalLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
    addTerminalLine("All verification steps completed successfully!", "success");
    addTerminalLine("Bundle is ready for deployment.", "success");
    
    setIsVerifying(false);
    setIsComplete(true);
    
    toast({
      title: "Verification Complete",
      description: "Chain of trust verification completed successfully!",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Preparing verified bundle for download...",
    });
  };

  const getStepProgress = () => {
    const verifiedCount = steps.filter(s => s.status === "verified").length;
    return (verifiedCount / steps.length) * 100;
  };

  const getStatusIcon = (status: TrustStep["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "verifying":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getTerminalLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command": return "text-cyan-400";
      case "success": return "text-emerald-400";
      case "error": return "text-red-400";
      case "info": return "text-zinc-400";
      default: return "text-zinc-300";
    }
  };

  return (
    <Card className="glass-lg border-animate">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Air-Gap Chain of Trust
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Verify the integrity of your air-gapped deployment pipeline
          </p>
        </div>
        <Button 
          onClick={runVerification}
          disabled={isVerifying}
          className="gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Verify Bundle Integrity
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="py-4">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.status === "verifying";
              const isComplete = step.status === "verified";
              const isFailed = step.status === "failed";
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div 
                      className={`
                        relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                        border-2 transition-all duration-300
                        ${isComplete ? "border-emerald-500 bg-emerald-950" : ""}
                        ${isActive ? "border-blue-500 bg-blue-950 scale-110" : ""}
                        ${isFailed ? "border-red-500 bg-red-950" : ""}
                        ${!isComplete && !isActive && !isFailed ? "border-zinc-700 bg-zinc-900" : ""}
                      `}
                    >
                      <Icon className={`w-5 h-5 ${
                        isComplete ? "text-emerald-500" :
                        isActive ? "text-blue-500" :
                        isFailed ? "text-red-500" :
                        "text-zinc-500"
                      }`} />
                    </div>
                    
                    {/* Label */}
                    <div className="mt-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {getStatusIcon(step.status)}
                        <span className={`text-sm font-medium ${
                          isComplete ? "text-emerald-400" :
                          isActive ? "text-blue-400" :
                          isFailed ? "text-red-400" :
                          "text-zinc-400"
                        }`}>
                          {step.name}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 mt-0.5 block">
                        {step.description}
                      </span>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <div className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5">
                      <div className="h-full bg-zinc-800 rounded-full" />
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          isComplete ? "bg-emerald-500 w-full" : "bg-zinc-800 w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Verification Output</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>
          
          <ScrollArea className="h-[240px]">
            <div ref={terminalRef} className="p-4 font-mono text-sm space-y-1">
              {terminalLines.length === 0 ? (
                <div className="text-zinc-600 italic">
                  Click "Verify Bundle Integrity" to start verification...
                </div>
              ) : (
                terminalLines.map((line, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-zinc-600 select-none w-20 flex-shrink-0">
                      {line.timestamp}
                    </span>
                    <span className={getTerminalLineColor(line.type)}>
                      {line.text || "\u00A0"}
                    </span>
                  </div>
                ))
              )}
              {isVerifying && (
                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-20 flex-shrink-0">
                    {new Date().toLocaleTimeString("en-US", { 
                      hour12: false, 
                      hour: "2-digit", 
                      minute: "2-digit", 
                      second: "2-digit" 
                    })}
                  </span>
                  <span className="text-zinc-400">
                    <span className="animate-pulse">▋</span>
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Status Summary & Download */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {steps.filter(s => s.status === "verified").length} / {steps.length} Verified
            </Badge>
            {steps.some(s => s.status === "failed") && (
              <Badge variant="destructive" className="text-xs">
                Verification Failed
              </Badge>
            )}
            {isComplete && (
              <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Ready for Deploy
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">
              Last verified: {new Date().toLocaleTimeString()}
            </span>
            
            {isComplete && (
              <Button 
                onClick={handleDownload}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                <Download className="w-4 h-4" />
                Download Bundle
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
