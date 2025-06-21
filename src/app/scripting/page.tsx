"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function ScriptingPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Scripting Module</h2>
            <p className="text-muted-foreground text-center">
              Coming soon: Create outlines, write scripts, and manage your content ideas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}