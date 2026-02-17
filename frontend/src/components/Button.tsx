import { tokens } from "../styles/tokens";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "success" | "error";
};

export default function Button({
  children,
  onClick,
  variant = "primary"
}: Props) {
  const bg =
    variant === "primary"
      ? tokens.colors.primary
      : variant === "success"
      ? tokens.colors.success
      : tokens.colors.error;

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: bg,
        color: tokens.colors.text,
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        borderRadius: tokens.radius.md,
        border: "none",
        cursor: "pointer",
        width: "100%",
        marginTop: tokens.spacing.sm
      }}
    >
      {children}
    </button>
  );
}
