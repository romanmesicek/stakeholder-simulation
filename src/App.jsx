import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './lib/RoleContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import ParticipantView from './pages/ParticipantView';
import FacilitatorHome from './pages/FacilitatorHome';
import FacilitatorDashboard from './pages/FacilitatorDashboard';
import FacilitatorMaterial from './pages/FacilitatorMaterial';
import FacilitatorRoles from './pages/FacilitatorRoles';
import InfoHub from './pages/InfoHub';
import InfoOverview from './pages/InfoOverview';
import InfoContentPage from './pages/InfoContentPage';
import LegacyInfoRedirect from './pages/LegacyInfoRedirect';
import StakeholdersOverview from './pages/StakeholdersOverview';
import RolesOverview from './pages/RolesOverview';
import RoleDetail from './pages/RoleDetail';
import Impressum from './pages/Impressum';
import FacilitatorGate from './components/FacilitatorGate';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <RoleProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="create" element={<CreateSession />} />
            <Route path="join/:sessionCode" element={<JoinSession />} />
            <Route path="session/:sessionCode" element={<ParticipantView />} />
            <Route element={<FacilitatorGate />}>
              <Route path="facilitate" element={<FacilitatorHome />} />
              <Route path="facilitate/:sessionCode" element={<FacilitatorDashboard />} />
              <Route path="facilitate/:sessionCode/roles" element={<FacilitatorRoles />} />
              <Route path="facilitate/materials/:contentKey" element={<FacilitatorMaterial />} />
            </Route>
            <Route path="info" element={<InfoHub />} />
            <Route path="info/:scenario/:level" element={<InfoOverview />} />
            <Route path="info/:scenario/:level/case" element={<InfoContentPage contentKey="situationBriefing" />} />
            <Route path="info/:scenario/:level/schedule" element={<InfoContentPage contentKey="schedule" />} />
            <Route path="info/:scenario/:level/reference" element={<InfoContentPage contentKey="keyFacts" />} />
            <Route path="info/:scenario/:level/stakeholders" element={<StakeholdersOverview />} />
            <Route path="info/:scenario/:level/roles" element={<RolesOverview />} />
            <Route path="info/:scenario/:level/roles/:roleId" element={<RoleDetail />} />
            {/* Legacy query-style URLs */}
            <Route path="info/case" element={<LegacyInfoRedirect sub="case" />} />
            <Route path="info/reference" element={<LegacyInfoRedirect sub="reference" />} />
            <Route path="info/schedule" element={<LegacyInfoRedirect sub="schedule" />} />
            <Route path="info/stakeholders" element={<LegacyInfoRedirect sub="stakeholders" />} />
            <Route path="info/roles" element={<LegacyInfoRedirect sub="roles" />} />
            <Route path="info/roles/:roleId" element={<LegacyInfoRedirect />} />
            <Route path="impressum" element={<Impressum />} />
          </Route>
        </Routes>
        </RoleProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
