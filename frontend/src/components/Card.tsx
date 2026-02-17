import { tokens } from "../styles/tokens";

export default function Card({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        padding: tokens.spacing.lg,
        borderRadius: tokens.radius.lg,
        marginTop: tokens.spacing.lg
      }}
    >
      {children}
    </div>
  );
}
