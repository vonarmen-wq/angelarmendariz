import { Routes, Route } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "@/pages/Index";
import Essays from "@/pages/Essays";
import Essay from "@/pages/Essay";
import About from "@/pages/About";
import Portfolio from "@/pages/Portfolio";
import ReadingStream from "@/pages/ReadingStream";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/admin/Dashboard";
import EssayEditor from "@/pages/admin/EssayEditor";
import SiteSettings from "@/pages/admin/SiteSettings";
import AdminEssays from "@/pages/admin/Essays";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminProjects from "@/pages/admin/Projects";
import AdminReadingItems from "@/pages/admin/ReadingItems";
import NotFound from "@/pages/NotFound";

export const AppRoutes = () => {
  usePageTracking();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/essays" element={<Essays />} />
      <Route path="/essays/:slug" element={<Essay />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/reading-stream" element={<ReadingStream />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/essays" element={<AdminEssays />} />
      <Route path="/admin/essays/:id" element={<EssayEditor />} />
      <Route path="/admin/settings" element={<SiteSettings />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/reading-items" element={<AdminReadingItems />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
