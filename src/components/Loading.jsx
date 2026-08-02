export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-slate-500">{text}</p>
    </div>
  );
}
