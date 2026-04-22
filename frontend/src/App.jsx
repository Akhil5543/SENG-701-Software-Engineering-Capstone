import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import MethodsPage from "./pages/MethodsPage";
import MethodDetail from "./pages/MethodDetail";
import { ArchitecturesPage, ArchitectureDetail } from "./pages/ArchitecturesPage";
import ToolsPage, { ToolDetail } from "./pages/ToolsPage";
import ComparePage from "./pages/ComparePage";
import AdminPage from "./pages/AdminPage";
import ExportPage from "./pages/ExportPage";
import ToolComparePage from "./pages/ToolComparePage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/methods" element={<MethodsPage />} />
          <Route path="/methods/:slug" element={<MethodDetail />} />
          <Route path="/architectures" element={<ArchitecturesPage />} />
          <Route path="/architectures/:slug" element={<ArchitectureDetail />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:slug" element={<ToolDetail />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/tool-compare" element={<ToolComparePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Routes>
      </Layout>
    </QueryClientProvider>
  );
}
