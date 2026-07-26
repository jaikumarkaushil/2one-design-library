/*
  Matches the Avatar component (2one Solutions "Mobile App Design System"
  file, node 138:81): circular, three types with a documented fallback
  priority — image > initial > icon. The Figma component is a fixed 40px,
  but real usage (bottom nav tab, feed post header) needs smaller sizes —
  `size` is passed as an inline style rather than a Tailwind height/width
  class specifically so a caller's `className` can never end up setting
  the same CSS property twice (the exact bug found earlier in TextField's
  border classes).
*/
type AvatarType = 'icon' | 'initial' | 'image'

export interface AvatarProps {
  type?: AvatarType
  initial?: string
  src?: string
  alt?: string
  size?: number
  className?: string
}

function UserIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle cx="8" cy="5.5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6H2Z" />
    </svg>
  )
}

export function Avatar({
  type = 'icon',
  initial,
  src,
  alt = '',
  size = 40,
  className = '',
}: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 ${className}`}
      style={{ width: size, height: size }}
    >
      {type === 'image' && src && (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
      {type === 'initial' && (
        <span className="text-base text-neutral-950" style={{ fontSize: Math.max(size * 0.4, 10) }}>
          {initial}
        </span>
      )}
      {type === 'icon' && (
        <UserIcon className="text-neutral-600" />
      )}
    </div>
  )
}
