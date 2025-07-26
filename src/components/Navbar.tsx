'use client'

import { 
  Shield, 
  Settings, 
  LogOut, 
  Activity, 
  Menu, 
  X, 
  AlertTriangle,
  BarChart3,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSecureSightStore } from '@/store/useSecureSightStore'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { incidents, cameras } = useSecureSightStore()
  const pathname = usePathname()
  
  const activeIncidents = incidents.filter(incident => !incident.resolved)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  // Enhanced navigation items with icons
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/cameras', label: 'Cameras', icon: Camera },
    { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { path: '/analytics', label: 'Analytics', icon: Activity },
  ]

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-8 lg:px-12">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Left section - Logo */}
          <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                SecureSight
              </h1>
              <p className="text-xs text-muted-foreground">Security Dashboard</p>
            </div>
          </div>

          {/* Center section - Pill-shaped Navigation */}
          <div className="flex-1 flex justify-center px-8">
            <div className="flex items-center bg-card/80 dark:bg-card/60 backdrop-blur-md border border-border/60 dark:border-border/40 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-11 px-6 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg" 
                          : "hover:bg-accent/70 dark:hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                      {item.label}
                      {item.label === 'Incidents' && activeIncidents.length > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
                        >
                          {activeIncidents.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right section - Controls */}
          <div className="flex items-center space-x-4 min-w-0 flex-shrink-0">
            {/* System Status */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Live</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {cameras.length} Cameras
              </Badge>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-border/50">
                      <AvatarImage src={session.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                        {getInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                          {getInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {session.user?.name && (
                          <p className="font-medium text-sm truncate">{session.user.name}</p>
                        )}
                        {session.user?.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                          </p>
                        )}
                        <Badge variant="secondary" className="w-fit text-xs mt-1">
                          {(session.user as { role?: string })?.role || 'OPERATOR'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="rounded-full">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Mobile Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              SecureSight
            </span>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-2">
            {activeIncidents.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeIncidents.length}
              </Badge>
            )}
            
            <ThemeToggle />

            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                        {getInitials(session.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="p-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                          {getInitials(session.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        {session.user?.name && (
                          <p className="font-medium text-xs truncate">{session.user.name}</p>
                        )}
                        <Badge variant="secondary" className="w-fit text-xs">
                          {(session.user as { role?: string })?.role || 'OPERATOR'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                
                return (
                  <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-12 text-sm font-medium",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "hover:bg-accent/50"
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                      {item.label === 'Incidents' && activeIncidents.length > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {activeIncidents.length}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
