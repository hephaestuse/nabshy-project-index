export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-black/15 bg-white p-4">
      <div className="text-sm font-semibold text-black/65">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-black">{value}</div>
    </div>
  );
}
