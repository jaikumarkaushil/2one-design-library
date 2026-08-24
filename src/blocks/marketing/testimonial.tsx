import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Testimonial — a quote + attribution inside a real Card, with an Avatar.
export function MarketingTestimonial({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("w-full border-b bg-background", className)} {...props}>
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
        <Card>
          <CardContent className="flex flex-col gap-6 p-8 md:p-10">
            <blockquote className="text-xl font-medium leading-relaxed text-balance md:text-2xl">
              “We stopped re-deciding what a button looks like. Everything we ship now looks
              like it came from the same place — and it ships faster.”
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" alt="" />
                <AvatarFallback>PS</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">Priya Sharma</div>
                <div className="text-muted-foreground">Head of Product, Acme</div>
              </div>
            </figcaption>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
