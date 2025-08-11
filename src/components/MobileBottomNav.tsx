import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Trophy, MessageCircle, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface MobileBottomNavProps {
  user?: SupabaseUser | null;
}

const MobileBottomNav = ({ user }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      requiresAuth: false,
    },
    {
      icon: Trophy,
      label: "Tournaments",
      path: "/tournaments",
      requiresAuth: true,
    },
    {
      icon: Plus,
      label: "Create",
      path: "/create",
      requiresAuth: true,
      isCenter: true,
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      requiresAuth: true,
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      requiresAuth: true,
    },
  ];

  const handleNavigation = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      navigate("/auth");
      return;
    }
    
    // Handle special routes
    if (path === "/create") {
      navigate("/create-tournament");
      return;
    }
    if (path === "/tournaments") {
      navigate("/");
      return;
    }
    if (path === "/profile") {
      navigate("/profile");
      return;
    }
    
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/landing")) {
      return true;
    }
    if (path === "/create" && (location.pathname.includes("create") || location.pathname.includes("start-stream"))) {
      return true;
    }
    if (path === "/tournaments" && location.pathname === "/") {
      return true;
    }
    if (path === "/messages" && location.pathname.includes("/messages")) {
      return true;
    }
    if (path === "/profile") {
      return false; // We'll implement this later
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center justify-center h-14 px-2 min-w-0 ${
                item.isCenter
                  ? "bg-primary text-primary-foreground rounded-full w-14 h-14 -mt-2 shadow-lg"
                  : active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleNavigation(item.path, item.requiresAuth)}
            >
              <Icon 
                size={item.isCenter ? 24 : 20} 
                className={item.isCenter ? "" : "mb-1"} 
              />
              {!item.isCenter && (
                <span className="text-xs leading-none">{item.label}</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;