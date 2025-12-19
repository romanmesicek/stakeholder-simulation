import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { getStakeholderById } from '../lib/stakeholders';

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
  const stakeholder = getStakeholderById(roleId);
  const content = roleContent[roleId];

  if (!stakeholder || !content) {
    return (
      <div>
        <BackButton to="/info/roles" label="Back to Roles" />
        <p className="text-slate-600">Role not found.</p>
      </div>
    );
  }

  return (
    <div>
      <BackButton to="/info/roles" label="Back to Roles" />
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{stakeholder.emoji}</span>
        <h1 className="text-2xl font-bold text-slate-800">{stakeholder.name}</h1>
      </div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
