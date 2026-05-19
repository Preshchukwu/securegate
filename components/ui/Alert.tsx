interface AlertProps {
  variant: "error" | "success" | "warning";
  children: React.ReactNode;
}

const styles = {
  error: {
    container: "bg-[var(--md-sys-color-error-container)] border-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error-container)]",
    icon: "text-[var(--md-sys-color-error)]",
  },
  success: {
    container: "bg-[var(--md-sys-color-tertiary-container)] border-[var(--md-sys-color-tertiary)] text-[var(--md-sys-color-on-tertiary-container)]",
    icon: "text-[var(--md-sys-color-tertiary)]",
  },
  warning: {
    container: "bg-amber-50 border-amber-400 text-amber-900",
    icon: "text-amber-600",
  },
};

const icons = {
  error: (
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
  ),
  success: (
    <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 01.02-.022z" clipRule="evenodd" />
  ),
  warning: (
    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4.5zm0 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
  ),
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${styles[variant].container}`}
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className={`h-4 w-4 mt-0.5 shrink-0 ${styles[variant].icon}`} aria-hidden="true">
        {icons[variant]}
      </svg>
      <span>{children}</span>
    </div>
  );
}
