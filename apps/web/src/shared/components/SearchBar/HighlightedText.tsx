type HighlightedTextProps = {
  text: string;
  query: string;
};

export function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query) {
    return <span className="font-bold text-black">{text}</span>;
  }

  const index = text.toLowerCase().indexOf(query.toLowerCase());

  if (index === -1) {
    return <span className="font-bold text-black">{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      <span className="font-normal text-gray-400">{before + match}</span>
      <span className="font-bold text-black">{after}</span>
    </>
  );
}
