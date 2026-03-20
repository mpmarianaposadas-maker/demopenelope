import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TipoTramiteProvider } from "@/contexts/TipoTramiteContext";
import { KillSwitchProvider } from "@/contexts/KillSwitchContext";
import { HistorialAccionesProvider } from "@/contexts/HistorialAccionesContext";
import { LedgerProvider } from "@/contexts/LedgerContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KillSwitchProvider>
        <TipoTramiteProvider>
          <HistorialAccionesProvider>
            <LedgerProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </LedgerProvider>
          </HistorialAccionesProvider>
        </TipoTramiteProvider>
      </KillSwitchProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
