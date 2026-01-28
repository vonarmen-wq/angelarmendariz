import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Essays from "./pages/Essays";
import Essay from "./pages/Essay";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import ReadingStream from "./pages/ReadingStream";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import EssayEditor from "./pages/admin/EssayEditor";
import SiteSettings from "./pages/admin/SiteSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/essays" element={<Essays />} />
          <Route path="/essays/:slug" element={<Essay />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/reading-stream" element={<ReadingStream />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/essays/:id" element={<EssayEditor />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
