import React, { ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import MobileBottomNav from "./MobileBottomNav";
import MobileHeader from "./MobileHeader";

interface MobileLayoutProps {
  children: ReactNode;
  user?: User | null;
  showHeader?: boolean;
  showBottomNav?: boolean;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileLayout = ({ 
  children, 
  user, 
  showHeader = true, 
  showBottomNav = true,
  title,
  showBackButton = false,
  onBack
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showHeader && (
        <MobileHeader 
          user={user} 
          title={title}
          showBackButton={showBackButton}
          onBack={onBack}
        />
      )}
      
      <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''} ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
      
      {showBottomNav && <MobileBottomNav user={user} />}
    </div>
  );
};

export default MobileLayout;