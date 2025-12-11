import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import AirGapDeploy from "./pages/AirGapDeploy";
import AirGapWizard from "./pages/AirGapWizard";
import ArtifactExplorer from "./pages/ArtifactExplorer";
import Vulnerabilities from "./pages/Vulnerabilities";
import Compliance from "./pages/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const basename = import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/airgap-deploy" element={<AirGapDeploy />} />
            <Route path="/airgap-deploy/artifacts" element={<ArtifactExplorer />} />
            <Route path="/airgap-deploy/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/airgap-deploy/compliance" element={<Compliance />} />
            <Route path="/airgap-wizard" element={<AirGapWizard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
