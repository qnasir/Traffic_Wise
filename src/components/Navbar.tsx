import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationCenter from "./NotificationCenter";
import AreaSubscription from "./AreaSubscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  Menu,
  AlertTriangle,
  MapPin,
  Bell,
  LayoutDashboard,
  Award,
  LogOut,
  User,
  Shield,
} from "lucide-react";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>({
    name: "Abdul Nasir Qureshi",
  });
  const [isAdmin, setIsAdmin] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-gray-900/75 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TrafficWise</span>
            </Link>
            <nav className="hidden md:flex ml-6 gap-1">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>
              <a href="#reports">
                <Button variant="ghost" size="sm">
                  Reports
                </Button>
              </a>
              <a href="#reports-section">
                <Button variant="ghost" size="sm">
                  Report Issue
                </Button>
              </a>
              {isAuthenticated && (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    My Dashboard
                  </Button>
                </Link>
              )}
              <a href="#about">
                <Button variant="ghost" size="sm">
                  About
                </Button>
              </a>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" onClick={()=>setShowSubscribeDialog(true)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Subscribe to Area
                </Button>
                {/* Change With NotificationCenter Component */}
                <Button variant="ghost" size="sm">
                  <Bell />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs font-muted-foreground">
                          {user?.name}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setShowSubscribeDialog(true)}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Manage Alerts</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/badges">
                        <Award className="mr-2 h-4 w-4" />
                        <span>My Badges</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button size="sm">Sign In</Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setShowMobileMenu(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Home
              </Button>
            </Link>
            <a href="#reports" onClick={() => setShowMobileMenu(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Reports
              </Button>
            </a>
            <a href="#report-section" onClick={() => setShowMobileMenu(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Report Issue
              </Button>
            </a>
            {isAuthenticated && (
              <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  My Dashboard
                </Button>
              </Link>
            )}
            <a href="#about" onClick={() => setShowMobileMenu(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                About
              </Button>
            </a>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.name}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowSubscribeDialog(true);
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Subscribe to Area
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowMobileMenu(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Profile
                  </Button>
                  
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setShowMobileMenu(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowMobileMenu(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Area Subscribtion Dialog */}
      <AreaSubscription isOpen={showSubscribeDialog} onOpenChange={setShowSubscribeDialog} />
    </header>
  );
}

export default Navbar;
