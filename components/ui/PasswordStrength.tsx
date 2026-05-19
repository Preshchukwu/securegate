"use client";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!password) return { level: 0, label: "" };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const typeCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

  if (password.length < 8 || typeCount < 2) return { level: 1, label: "Weak" };
  if (password.length < 12 || typeCount < 3) return { level: 2, label: "Fair" };
  return { level: 3, label: "Strong" };
}

const activeColor: Record<1 | 2 | 3, string> = {
  1: "bg-[var(--color-role-strength-weak)]",
  2: "bg-[var(--color-role-strength-fair)]",
  3: "bg-[var(--color-role-strength-strong)]",
};

const labelColor: Record<1 | 2 | 3, string> = {
  1: "text-[var(--color-role-strength-weak)]",
  2: "text-[var(--color-role-strength-fair)]",
  3: "text-[var(--color-role-strength-strong)]",
};

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { level, label } = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5" role="img" aria-label={`Password strength: ${label}`}>
        {([1, 2, 3] as const).map((seg) => (
          <div
            key={seg}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              level >= seg && level !== 0
                ? activeColor[level]
                : "bg-[var(--md-sys-color-surface-variant)]"
            }`}
          />
        ))}
      </div>
      {label && level !== 0 && (
        <p className={`text-xs font-medium ${labelColor[level]}`}>{label}</p>
      )}
    </div>
  );
}
