import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './lib/RoleContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import InfoHub from './pages/InfoHub';
import CasePage from './pages/CasePage';
import ReferencePage from './pages/ReferencePage';
import SchedulePage from './pages/SchedulePage';
import RolesOverview from './pages/RolesOverview';
import RoleDetail from './pages/RoleDetail';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="info" element={<InfoHub />} />
            <Route path="info/case" element={<CasePage />} />
            <Route path="info/reference" element={<ReferencePage />} />
            <Route path="info/schedule" element={<SchedulePage />} />
            <Route path="info/roles" element={<RolesOverview />} />
            <Route path="info/roles/:roleId" element={<RoleDetail />} />
          </Route>
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  );
}
