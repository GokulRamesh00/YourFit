import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SupabaseInitializer from "./components/SupabaseInitializer";
import EmailJSProvider from "./components/EmailJSProvider";
import Products from './pages/Products';
import Product from './pages/Product';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import SizeGuide from './pages/SizeGuide';
import SizingDemo from './pages/SizingDemo';
import SizeHistoryStorage from './components/SizeHistoryStorage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EmailJSProvider>
      <TooltipProvider>
        <SupabaseInitializer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<Product />} />
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="profile" element={<Profile />} />
              <Route path="size-guide" element={<SizeGuide />} />
              <Route path="sizing-demo" element={<SizingDemo />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </EmailJSProvider>
    <SizeHistoryStorage />
  </QueryClientProvider>
);

export default App;
