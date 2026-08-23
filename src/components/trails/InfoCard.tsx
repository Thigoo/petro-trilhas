export function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border shadow-sm text-muted-foreground">
      <div className="text-medium-green mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-widest font-medium">{label}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
