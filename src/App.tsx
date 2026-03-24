import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import SubmitShop from "./pages/SubmitShop";
import Settings from "./pages/Settings";
import AdminFeedback from "./pages/AdminFeedback";
import MyFeedback from "./pages/MyFeedback";
import Requests from "./pages/Requests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/:itemId" element={<ItemDetail />} />
            <Route path="/submit" element={<SubmitShop />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<MyFeedback />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
