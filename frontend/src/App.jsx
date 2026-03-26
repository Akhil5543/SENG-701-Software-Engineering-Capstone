import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import MethodsPage from './pages/MethodsPage'
import MethodDetail from './pages/MethodDetail'
import { ArchitecturesPage, ArchitectureDetail } from './pages/ArchitecturesPage'
import ToolsPage from './pages/ToolsPage'
import ToolDetail from './pages/ToolDetail'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
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
      </Routes>
    </Layout>
  )
}
