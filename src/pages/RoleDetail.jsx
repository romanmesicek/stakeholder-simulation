import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getStakeholderById } from '../lib/stakeholders';
import { useRole } from '../lib/RoleContext';

// Import all role markdown files
import management from '../content/roles/01_PowerShift_Management_RoleCard.md?raw';
import workers from '../content/roles/02_Workers_Union_RoleCard.md?raw';
import community from '../content/roles/03_Community_Coalition_RoleCard.md?raw';
import environmental from '../content/roles/04_Environmental_Alliance_RoleCard.md?raw';
import government from '../content/roles/05_Regional_Government_RoleCard.md?raw';
import indigenous from '../content/roles/06_Indigenous_Community_RoleCard.md?raw';
import investors from '../content/roles/07_Investor_Coalition_RoleCard.md?raw';
import technical from '../content/roles/08_Technical_Expert_Panel_RoleCard.md?raw';

const roleContent = {
  management,
  workers,
  community,
  environmental,
  government,
  indigenous,
  investors,
  technical,
};

export default function RoleDetail() {
  const { roleId } = useParams();
  const { selectedRoleId, setSelectedRoleId } = useRole();
  const stakeholder = getStakeholderById(roleId);
  const content = roleContent[roleId];
  const isMyRole = selectedRoleId === roleId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [roleId]);

  if (!stakeholder || !content) {
    return (
      <div>
        <BackButton to="/info/roles" label="Back to Roles" />
        <p className="text-slate-600">Role not found.</p>
      </div>
    );
  }

  const handleSelectRole = () => {
    setSelectedRoleId(roleId);
  };

  const handleClearRole = () => {
    setSelectedRoleId(null);
  };

  return (
    <div>
      <BackButton to="/info/roles" label="Back to Roles" />
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{stakeholder.emoji}</span>
          <h1 className="text-2xl font-bold text-slate-800">{stakeholder.name}</h1>
        </div>
        {isMyRole ? (
          <button
            onClick={handleClearRole}
            className="text-sm px-3 py-1.5 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Clear selection
          </button>
        ) : (
          <button
            onClick={handleSelectRole}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Select as my role
          </button>
        )}
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
