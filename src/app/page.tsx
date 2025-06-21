import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Clock, TrendingUp, AlertCircle, Play, Star, Users, Gauge } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[80px] font-black tracking-tight leading-[0.9]">
            Why Create <br/> When You Can Steal?
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto pt-4">
            Every successful YouTuber is already doing it. They analyze viral videos, extract
            the patterns, and recreate with their own twist. We just made it systematic.
          </p>


          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-10 h-14 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                Start stealing in 30 min
              </Button>
            </Link>
            <Link href="#demo-video">
              <Button size="lg" variant="ghost" className="text-lg px-8 h-14">
                <Play className="mr-2 h-5 w-5" />
                Watch demo
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">4.9 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">1k+ growth community</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">4.8 rating</span>
            </div>
          </div>

          {/* Clickable Platform Preview - Links to Demo */}
          <div className="relative mt-12 max-w-5xl mx-auto">
            <Link href="#demo-video" className="block group">
              <div className="relative overflow-hidden rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 transition-all group-hover:shadow-3xl group-hover:scale-[1.02]">
                {/* Browser Frame */}
                <div className="bg-gray-100 dark:bg-gray-800 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Theft System™ - Discovery Module</div>
                  </div>
                  <Button size="sm" className="h-6 text-xs px-3">Publish</Button>
                </div>
                
                {/* Platform Screenshot/GIF Placeholder */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 aspect-[16/10]">
                  <div className="p-8">
                    <div className="max-w-md mx-auto">
                      {/* Mock Question Card */}
                      <Card className="p-6 shadow-lg">
                        <div className="text-sm text-gray-500 mb-2">Question 1 of 3</div>
                        <h3 className="text-xl font-bold mb-4">What viral format will you steal?</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                            <div className="text-2xl mb-1">🎮</div>
                            <div className="text-sm font-medium">Gaming</div>
                          </div>
                          <div className="p-4 border-2 rounded-lg hover:border-gray-300">
                            <div className="text-2xl mb-1">💻</div>
                            <div className="text-sm font-medium">Tech</div>
                          </div>
                          <div className="p-4 border-2 rounded-lg hover:border-gray-300">
                            <div className="text-2xl mb-1">🎨</div>
                            <div className="text-sm font-medium">Lifestyle</div>
                          </div>
                          <div className="p-4 border-2 rounded-lg hover:border-gray-300">
                            <div className="text-2xl mb-1">📚</div>
                            <div className="text-sm font-medium">Education</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-black/90 rounded-full p-6 shadow-2xl">
                        <Play className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Caption */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Click to watch 5-minute demo
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-12">
              The Creator's Paradox
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">AI Everywhere</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Everyone has the same tools</li>
                  <li>• Content feels manufactured</li>
                  <li>• Viewers skip generic AI videos</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <Users className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Authenticity Wins</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Human connection matters more</li>
                  <li>• Real stories beat perfect edits</li>
                  <li>• Raw footage outperforms polish</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <Clock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Speed is Everything</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Algorithm rewards consistency</li>
                  <li>• First mover advantage</li>
                  <li>• Ship fast or die slow</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo-video" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              See The System in Action
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
              Watch how we turn any viral video into your next hit in under 30 minutes
            </p>
          </div>

          {/* Demo Video */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-24 h-24 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xl">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">Watch 5-Min Demo</p>
                    <p className="text-sm text-muted-foreground mt-2">See how Sarah went from 0 to 100K subs in 60 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 text-center">
            <div>
              <div className="text-3xl font-black text-primary">3 min</div>
              <p className="text-sm text-muted-foreground mt-1">Find viral opportunity</p>
            </div>
            <div>
              <div className="text-3xl font-black text-primary">15 min</div>
              <p className="text-sm text-muted-foreground mt-1">Clone & customize script</p>
            </div>
            <div>
              <div className="text-3xl font-black text-primary">12 min</div>
              <p className="text-sm text-muted-foreground mt-1">Edit & publish</p>
            </div>
          </div>
        </div>
      </section>



      {/* Solution Section - The Theft System™ */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-4">
            The Theft System™
          </h2>
          <p className="text-xl text-center text-muted-foreground font-medium max-w-3xl mx-auto mb-16">
            Four AI-powered modules that turn stealing into a science
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Discovery */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-red-600">"Spy on Success"</h4>
                </div>
                <h3 className="text-2xl font-bold">Discovery Engine</h3>
                <p className="text-muted-foreground font-medium">
                  Stop creating blindly. Spy on what's actually working right now in your niche.
                </p>
                
                {/* Feature Preview */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 rounded-lg p-4 mt-6 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">VIRAL</div>
                      <div className="flex-1">
                        <div className="h-2 bg-red-600/20 rounded-full w-full overflow-hidden">
                          <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-[3000ms]" style={{width: '92%'}}></div>
                        </div>
                      </div>
                      <span className="text-sm font-bold">92%</span>
                    </div>
                    <div className="text-sm font-medium">"How I Made $1M" format trending 🔥</div>
                    <div className="flex gap-2">
                      <div className="text-xs bg-white/80 dark:bg-black/20 px-2 py-1 rounded transition-opacity duration-1000">12 competitors using</div>
                      <div className="text-xs bg-white/80 dark:bg-black/20 px-2 py-1 rounded transition-opacity duration-1000">+847% growth</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Real-time viral theft opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Competitor success tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>"What to steal next" AI</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Scripting */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-purple-600">"Clone What Works"</h4>
                </div>
                <h3 className="text-2xl font-bold">Script Stealer</h3>
                <p className="text-muted-foreground font-medium">
                  Why write when you can remix? Copy viral hooks and adapt proven narratives.
                </p>
                
                {/* Feature Preview */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 rounded-lg p-4 mt-6">
                  <div className="space-y-2 font-mono text-sm">
                    <div className="text-purple-600 font-bold">// Viral Hook Template</div>
                    <div className="bg-white/60 dark:bg-black/20 p-2 rounded">
                      <span className="text-purple-600">"</span>I tried [trending_topic] for 30 days<br/>
                      and [unexpected_result]...<span className="text-purple-600">"</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div className="text-xs bg-purple-600/20 px-2 py-1 rounded">78% retention</div>
                      <div className="text-xs bg-purple-600/20 px-2 py-1 rounded">14M views avg</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Viral hook theft library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Proven narrative structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>"Change 20% rule" for originality</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Editing */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-blue-600">"Ship Before Perfect"</h4>
                </div>
                <h3 className="text-2xl font-bold">Edit Assistant</h3>
                <p className="text-muted-foreground font-medium">
                  Good enough &gt; Perfect. Ship in hours, not weeks. Let viewers choose quality.
                </p>
                
                {/* Feature Preview */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 rounded-lg p-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Edit Quality Score</span>
                      <span className="text-2xl font-bold text-blue-600">73%</span>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-[2000ms]" style={{width: '73%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600 font-medium">✓ Good enough to ship!</span>
                      <span className="text-muted-foreground">Est. 2.5 hrs</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Minimal viable edits only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Speed &gt; Polish metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>"Good enough" calculator</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Analytics */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <h4 className="text-lg font-semibold text-green-600">"Know Before You Post"</h4>
                </div>
                <h3 className="text-2xl font-bold">Performance Predictor</h3>
                <p className="text-muted-foreground font-medium">
                  Will this theft work? Know what to steal next and kill losers fast.
                </p>
                
                {/* Feature Preview - Analytics Graph */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 rounded-lg p-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Viral Probability</span>
                      <span className="text-green-600 font-bold">94% 🚀</span>
                    </div>
                    <div className="flex items-end gap-1 h-16">
                      <div className="flex-1 bg-green-200 dark:bg-green-800/30 rounded-t transition-all duration-[4000ms] hover:bg-green-300" style={{height: '30%'}}></div>
                      <div className="flex-1 bg-green-300 dark:bg-green-700/40 rounded-t transition-all duration-[4000ms] hover:bg-green-400" style={{height: '45%'}}></div>
                      <div className="flex-1 bg-green-400 dark:bg-green-600/50 rounded-t transition-all duration-[4000ms] hover:bg-green-500" style={{height: '70%'}}></div>
                      <div className="flex-1 bg-green-500 dark:bg-green-500/60 rounded-t transition-all duration-[4000ms] hover:bg-green-600" style={{height: '85%'}}></div>
                      <div className="flex-1 bg-green-600 rounded-t transition-all duration-[4000ms]" style={{height: '100%'}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mon</span>
                      <span>Tech Explained</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Will this theft work? (94% accurate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Viral probability score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>A/B theft testing</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Objection Handling - Redesigned */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
              Common Concerns (We Get It)
            </h2>
            
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">"Isn't This Unethical?"</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Every musician learns by playing covers. Every writer reads before they write. 
                      Every chef learns recipes before creating their own. We're just honest about how YouTube really works. 
                      You're not stealing videos - you're learning from patterns that work, then adding your unique perspective.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">"What About Copyright?"</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We teach you to steal ideas, not content. Concepts, formats, and structures aren't copyrighted - 
                      only specific expressions are. You'll learn the difference and stay 100% legal while using 
                      proven frameworks. Think of it as reverse-engineering success, not copying.
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">"Will This Make Me Inauthentic?"</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Authenticity isn't about being 100% original - it's about being genuinely you. 
                      Use proven structures to tell YOUR story with YOUR voice. The framework is borrowed, 
                      but the content, personality, and perspective are uniquely yours. That's what viewers connect with.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-red-600/5 to-red-600/10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black">
              The 2025 YouTube Era is Over
            </h2>
            <p className="text-lg text-muted-foreground">
              YouTube's algorithm and viewer expectations have evolved. Old rules don't apply. 
              Originality is dead. Authenticity + Speed wins.
            </p>
            <p className="text-lg text-muted-foreground">
              Build AI-powered production systems™ that decode viral mechanics and help you ship 10x faster. 
              Because in 2025, the best content isn't created - it's intelligently stolen.
            </p>
            <div className="pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-10 h-16 shadow-lg hover:shadow-xl transition-all">
                  Start Your Theft System
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card • Cancel anytime • Steal responsibly
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}