import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

interface MobileHeaderProps {
  user?: User | null;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileHeader = ({ user, title, showBackButton, onBack }: MobileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft size={20} />
            </Button>
          ) : (
            <Button variant="ghost" size="sm">
              <Menu size={20} />
            </Button>
          )}
          
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {title || "E-Football Hub"}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bell size={20} />
          </Button>
          
          {user && (
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getUserInitials(user.email)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;