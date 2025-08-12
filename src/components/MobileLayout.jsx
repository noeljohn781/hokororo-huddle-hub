import React from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileHeader from "./MobileHeader";

// Removed TypeScript interfaces for JavaScript

const MobileLayout = ({ 
  children, 
  user, 
  showHeader = true, 
  showBottomNav = true,
  title,
  showBackButton = false,
  onBack
}) => {
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