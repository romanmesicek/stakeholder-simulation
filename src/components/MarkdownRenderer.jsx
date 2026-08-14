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

// `lang` enables proper hyphenation (hyphens-auto picks the dictionary from
// the lang attribute) — pass the scenario language ('de'/'en') so long German
// compounds break with a hyphen instead of a hard wrap.
export default function MarkdownRenderer({ content, lang }) {
  return (
    <div
      lang={lang}
      className="prose prose-slate max-w-none break-words hyphens-auto prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 prose-table:text-sm"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
