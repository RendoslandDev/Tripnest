interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Circular avatar showing the user's initials (placeholder for a photo). */
export default function Avatar({ name, size = 36, className = '' }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
