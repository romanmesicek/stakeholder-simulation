import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import schedule from '../content/shared/simulation-instructions.md?raw';

export default function SchedulePage() {
  return (
    <div>
      <BackButton to="/info" label="Back to Info Hub" />
      <MarkdownRenderer content={schedule} />
    </div>
  );
}
