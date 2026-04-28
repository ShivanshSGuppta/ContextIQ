export function ContextIQLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" fill="#111827" />
      <circle cx="54" cy="50" r="22" fill="#2563EB" opacity="0.8" filter="blur(5px)" />
      <circle cx="54" cy="50" r="15" fill="#3B82F6" />
      <path
        d="M 28 18
             H 68
             A 14 14 0 0 1 82 32
             C 82 42, 66 40, 66 50
             C 66 60, 82 58, 82 68
             A 14 14 0 0 1 68 82
             H 28
             A 14 14 0 0 1 14 68
             V 32
             A 14 14 0 0 1 28 18
             Z"
        stroke="#F8FAFC"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
