"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, TrendingUp, User, LogOut } from "lucide-react"
import { NotificationCenter } from "@/components/notification-center"
import { useAuth } from "@/contexts/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user, signOut, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6" />
            <span className="inline-block font-bold">ViralDash</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Analytics
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user && <NotificationCenter />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {loading ? (
            <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved">
                    <User className="mr-2 h-4 w-4" />
                    Saved Videos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}