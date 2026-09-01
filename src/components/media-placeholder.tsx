import * as React from 'react'
import { ImageOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'

/*
  MediaPlaceholder — the sanctioned "no image yet" surface (2one-authored; no
  shadcn equivalent). The system ships no photography and forbids inventing stock
  (manifest → assets.absent), so image-first products need ONE honest, on-brand,
  audit-clean stand-in instead of hand-rolling a different empty box on every
  screen. This is the strategy in docs/placeholders.md, shipped as a component —
  and the media slot the feed-item / profile-header / media-gallery patterns refer to.

  A muted, dashed surface with a lucide glyph and an optional caption, held to an
  aspect ratio. Token-driven (bg-muted / text-muted-foreground / border), so it
  reads correctly in light and dark with no colour-alone signal. Accessibility:
  with a `label` it is role="img" and that label is its accessible name; without
  one it is decorative and hidden from assistive tech.
*/
export interface MediaPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio as width / height — e.g. 16 / 9 (default), 1 (square), 4 / 3. */
  ratio?: number
  /** Centred lucide glyph; defaults to ImageOff. */
  icon?: React.ReactNode
  /** Short caption (e.g. "No photo yet") — also the accessible name when present. */
  label?: string
}

export function MediaPlaceholder({ ratio = 16 / 9, icon, label, className, ...props }: MediaPlaceholderProps) {
  return (
    <AspectRatio ratio={ratio} data-slot="media-placeholder">
      <div
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className={cn(
          'flex size-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted text-muted-foreground',
          className,
        )}
        {...props}
      >
        <span className="flex items-center justify-center [&_svg]:size-6" aria-hidden>
          {icon ?? <ImageOff />}
        </span>
        {label && <span className="text-xs">{label}</span>}
      </div>
    </AspectRatio>
  )
}
