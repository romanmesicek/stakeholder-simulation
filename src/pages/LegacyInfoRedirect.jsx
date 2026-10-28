import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { SCENARIOS, resolveLevel } from '../lib/stakeholders';
import { infoPath } from '../lib/infoPaths';
import { useRole } from '../lib/useRole';

// Old query-style info URLs (/info/case?scenario=x&level=y, /info/roles/:id …)
// redirect to the path-based routes. The level falls back to the joined
// session's level, then the scenario default, as before.
export default function LegacyInfoRedirect({ sub }) {
  const { roleId } = useParams();
  const [searchParams] = useSearchParams();
  const { selectedScenario, selectedLevel } = useRole();

  const requested = searchParams.get('scenario') || selectedScenario;
  const scenario = SCENARIOS[requested] ? requested : 'energy-transition';
  const level = resolveLevel(scenario, searchParams.get('level'), selectedScenario, selectedLevel);
  const target = roleId ? `roles/${roleId}` : sub;

  return <Navigate to={infoPath(scenario, level, target)} replace />;
}
