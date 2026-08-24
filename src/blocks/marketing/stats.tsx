import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const STATS = [
  { value: "57", label: "Components" },
  { value: "40", label: "Templates" },
  { value: "100%", label: "APCA audited" },
  { value: "2", label: "Themes" },
]

// Stats band — a metrics/numbers row. Grayscale; numbers in the heading face.
export function MarketingStats({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-muted/40", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
              {i < STATS.length - 1 && (
                <Separator orientation="vertical" className="hidden h-12 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
