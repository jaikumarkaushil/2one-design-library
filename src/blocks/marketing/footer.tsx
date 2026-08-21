import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { Separator } from "@/components/ui/separator"

const COLUMNS = [
  { title: "Product", links: ["Components", "Templates", "Pricing", "Changelog"] },
  { title: "Resources", links: ["Docs", "Recipes", "Knowledge graph", "Accessibility"] },
  { title: "Company", links: ["About", "Brand", "Contact", "Careers"] },
]

// Marketing footer — nav columns + the 2one Logo. The mark is theme-adaptive
// (black on light, white on dark) via .dark, per the brand rule.
export function MarketingFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer className={cn("w-full border-t bg-background", className)} {...props}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo variant="black" width={64} className="dark:hidden" />
            <Logo variant="white" width={64} className="hidden dark:block" />
            <p className="max-w-xs text-sm text-muted-foreground">
              One place for every piece 2one builds — so people and AI create products that
              look and feel like 2one.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{col.title}</h3>
              {col.links.map((l) => (
                <a key={l} href="#" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  {l}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} 2one Solutions. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">Privacy</a>
            <a href="#" className="underline-offset-4 hover:text-foreground hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
