export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="4" fill="var(--primary)" />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6"
        stroke="var(--primary)"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6"
        stroke="var(--primary)"
        strokeWidth="1.5"
        opacity="0.45"
        transform="rotate(60 16 16)"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6"
        stroke="var(--primary)"
        strokeWidth="1.5"
        opacity="0.45"
        transform="rotate(120 16 16)"
      />
    </svg>
  )
}
