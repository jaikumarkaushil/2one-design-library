import { Aperture, Command, Frame, Hexagon, Orbit, Triangle } from "lucide-react"

import { cn } from "@/lib/utils"

// Logo cloud — a "trusted by" row of grayscale marks. Placeholder wordmarks
// (a lucide mark + name, muted) — swap in real customer SVGs. Grayscale only.
const MARKS = [
  { icon: Hexagon, name: "Hexon" },
  { icon: Orbit, name: "Orbital" },
  { icon: Triangle, name: "Delta" },
  { icon: Frame, name: "Frame" },
  { icon: Aperture, name: "Aperture" },
  { icon: Command, name: "Cmd" },
]

export function MarketingLogoCloud({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-background", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trusted by teams building with structure
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-muted-foreground">
          {MARKS.map(({ icon: Icon, name }) => (
            <div key={name} className="flex items-center gap-2">
              <Icon className="size-6" aria-hidden />
              <span className="text-lg font-semibold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
