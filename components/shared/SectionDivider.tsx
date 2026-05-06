interface SectionDividerProps {
  kanji: string;
}

export default function SectionDivider({ kanji }: SectionDividerProps) {
  return (
    <div className="flex items-center justify-center py-20 overflow-hidden">
      <div className="h-px w-20 bg-text-muted/30" />
      <span className="mx-6 text-xl shippori-mincho text-text-muted">{kanji}</span>
      <div className="h-px w-20 bg-text-muted/30" />
    </div>
  );
}
