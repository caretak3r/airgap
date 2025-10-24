import { Card } from "@/components/ui/card";
import { Package, Shield, Download, CheckCircle } from "lucide-react";

const stats = [
  {
    label: "Total Artifacts",
    value: "24",
    icon: Package,
    trend: "+3 this week",
  },
  {
    label: "Verified Packages",
    value: "24/24",
    icon: Shield,
    trend: "100% coverage",
  },
  {
    label: "Downloads",
    value: "156",
    icon: Download,
    trend: "+12% this month",
  },
  {
    label: "Active Deployments",
    value: "8",
    icon: CheckCircle,
    trend: "4 air-gapped",
  },
];

export function DeploymentStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-3xl font-bold text-card-foreground mb-1">{stat.value}</p>
          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-xs text-success">{stat.trend}</p>
        </Card>
      ))}
    </div>
  );
}
