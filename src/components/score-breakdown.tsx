import { Info, TrendingUp, Users, Heart, Clock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import type { ViralVideo } from "@/types/youtube"

interface ScoreBreakdownProps {
  video: ViralVideo
}

export function ScoreBreakdown({ video }: ScoreBreakdownProps) {
  if (!video.scoreBreakdown) return null

  const { scoreBreakdown } = video
  const { explanation } = scoreBreakdown

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Info className="h-3 w-3" />
            Score Details
          </button>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-4">
          <div className="space-y-3">
            <div className="font-semibold text-sm">Viral Score Breakdown</div>
            
            {/* Subscriber Impact */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Subscriber Impact (40%)
                </span>
                <span className="font-medium">{scoreBreakdown.subscriberImpact}/100</span>
              </div>
              <Progress value={scoreBreakdown.subscriberImpact} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Views are {explanation.subscriberRatio}
              </p>
            </div>

            {/* View Velocity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  View Velocity (30%)
                </span>
                <span className="font-medium">{scoreBreakdown.viewVelocity}/100</span>
              </div>
              <Progress value={scoreBreakdown.viewVelocity} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {explanation.viewsPerDay}
              </p>
            </div>

            {/* Engagement Score */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  Engagement (20%)
                </span>
                <span className="font-medium">{scoreBreakdown.engagementScore}/100</span>
              </div>
              <Progress value={scoreBreakdown.engagementScore} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {explanation.engagementRate} engagement rate
              </p>
            </div>

            {/* Freshness Bonus */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Freshness (10%)
                </span>
                <span className="font-medium">{scoreBreakdown.freshnessBonus}/100</span>
              </div>
              <Progress value={scoreBreakdown.freshnessBonus} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                Published {explanation.ageInDays} day{explanation.ageInDays !== 1 ? 's' : ''} ago
              </p>
            </div>

            {/* Viral Potential */}
            {video.viralPotential && (
              <div className="pt-2 border-t">
                <p className="text-xs">
                  <span className="font-medium">Viral Potential:</span>{' '}
                  <span className={
                    video.viralPotential.includes('Very High') ? 'text-green-600' :
                    video.viralPotential.includes('High') ? 'text-yellow-600' :
                    video.viralPotential.includes('Medium') ? 'text-orange-600' :
                    'text-muted-foreground'
                  }>
                    {video.viralPotential}
                  </span>
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}