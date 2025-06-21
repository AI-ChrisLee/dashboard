"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Film } from "lucide-react"

export default function EditingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Film className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Editing Module</h2>
            <p className="text-muted-foreground text-center">
              Coming soon: Upload footage, generate transcripts, and sync your content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}