import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Search, TrendingUp, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Discover Viral YouTube Videos <br className="hidden sm:inline" />
            Before They Explode
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Our advanced algorithm identifies videos with viral potential by analyzing subscriber count, 
            views, and engagement rates. Find hidden gems in your niche before everyone else.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Everything you need to discover the next viral sensation
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Search className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Smart Search</h3>
                <p className="text-sm text-muted-foreground">
                  Search by keywords and find videos with the highest viral potential
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <TrendingUp className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Viral Score</h3>
                <p className="text-sm text-muted-foreground">
                  Our algorithm calculates viral potential based on multiple factors
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <BarChart3 className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track performance metrics and engagement rates over time
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when videos start trending in your niche
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Ready to find viral videos?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Start discovering hidden gems before they go viral
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-4">
              Start Searching Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}