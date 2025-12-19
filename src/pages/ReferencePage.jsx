import BackButton from '../components/BackButton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import keyFacts from '../content/shared/key-facts-reference.md?raw';

export default function ReferencePage() {
  return (
    <div>
      <BackButton to="/info" label="Back to Info Hub" />
      <MarkdownRenderer content={keyFacts} />
    </div>
  );
}
