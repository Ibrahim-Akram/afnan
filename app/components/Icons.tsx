type IconProps = {className?: string};

export function Crescent({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 2.5a9.5 9.5 0 1 0 7 15.9A8 8 0 1 1 14.5 2.5Z"
      />
      <path
        fill="currentColor"
        d="m18 5 .7 1.6 1.8.2-1.3 1.2.4 1.8-1.6-.9-1.6.9.4-1.8-1.3-1.2 1.8-.2Z"
      />
    </svg>
  );
}

export function Lantern({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 40 80" aria-hidden="true">
      <line x1="20" y1="0" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 14h12l-2 6h-8Z" fill="currentColor" />
      <path
        d="M12 20h16l4 16-4 22H12L8 36Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M20 20v38M10 36h20" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <circle cx="20" cy="40" r="4" fill="currentColor" opacity=".55" />
      <path d="M12 58h16l-3 6H15Z" fill="currentColor" />
    </svg>
  );
}

export function BagIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UserIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MenuIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function GiftIcon({className}: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
