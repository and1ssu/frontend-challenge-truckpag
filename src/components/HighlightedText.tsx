import { escapeRegExp } from '../utils/text';

interface HighlightedTextProps {
  text: string;
  query: string;
  enabled: boolean;
}

export function HighlightedText({ text, query, enabled }: HighlightedTextProps) {
  if (!enabled || !query.trim()) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();

        if (!isMatch) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark key={`${part}-${index}`} className="rounded bg-[#e50914] px-1 text-white">
            {part}
          </mark>
        );
      })}
    </>
  );
}
