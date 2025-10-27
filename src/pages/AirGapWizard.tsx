import { ThemeToggle } from "@/components/ThemeToggle";
import { MirrorWizard } from "@/components/MirrorWizard";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AirGapWizard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Air Gapped Deployment Wizard</h1>
                <p className="text-xs text-muted-foreground">Guided Artifact Mirroring</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mirror Artifacts for Air-Gapped Deployment
          </h2>
          <p className="text-muted-foreground text-lg">
            Follow our guided wizard to download and mirror Helm charts, Docker images, signatures, and SBOMs
            from <span className="font-mono text-primary">register.company.com</span> and{" "}
            <span className="font-mono text-primary">proxy.company.com</span>
          </p>
        </div>

        {/* Wizard */}
        <MirrorWizard />
      </main>
    </div>
  );
};

export default AirGapWizard;
