import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import situationBriefing from '../content/shared/situation-briefing.md?raw';

export default function CasePage() {
  return (
    <div>
      <BackButton to="/info" label="Back to Info Hub" />
      <MarkdownRenderer content={situationBriefing} />
    </div>
  );
}
