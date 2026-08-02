import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Wide tables (e.g. measurement data in the key facts) must scroll
// horizontally on phones instead of squeezing into unreadable columns.
const components = {
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
