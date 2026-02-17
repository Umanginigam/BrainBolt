import { tokens } from "../styles/tokens";

export default function StatBadge({
  label,
  value
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        marginRight: tokens.spacing.md
      }}
    >
      <strong>{label}:</strong> {value}
    </div>
  );
}
