import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './lib/RoleContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import ParticipantView from './pages/ParticipantView';
import FacilitatorHome from './pages/FacilitatorHome';
import FacilitatorDashboard from './pages/FacilitatorDashboard';
import InfoHub from './pages/InfoHub';
import CasePage from './pages/CasePage';
import ReferencePage from './pages/ReferencePage';
import SchedulePage from './pages/SchedulePage';
import StakeholdersOverview from './pages/StakeholdersOverview';
import RolesOverview from './pages/RolesOverview';
import RoleDetail from './pages/RoleDetail';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="create" element={<CreateSession />} />
            <Route path="join/:sessionCode" element={<JoinSession />} />
            <Route path="session/:sessionCode" element={<ParticipantView />} />
            <Route path="facilitate" element={<FacilitatorHome />} />
            <Route path="facilitate/:sessionCode" element={<FacilitatorDashboard />} />
            <Route path="info" element={<InfoHub />} />
            <Route path="info/case" element={<CasePage />} />
            <Route path="info/reference" element={<ReferencePage />} />
            <Route path="info/schedule" element={<SchedulePage />} />
            <Route path="info/stakeholders" element={<StakeholdersOverview />} />
            <Route path="info/roles" element={<RolesOverview />} />
            <Route path="info/roles/:roleId" element={<RoleDetail />} />
          </Route>
        </Routes>
      </RoleProvider>
    </BrowserRouter>
  );
}
