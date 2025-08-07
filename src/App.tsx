import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/AuthPage";
import UserManagement from "./components/UserManagement";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import LandingPage from "./pages/LandingPage";
import JoinTournamentPage from "./pages/JoinTournamentPage";
import MessagesPage from "./pages/MessagesPage";
import CreateTournamentPage from "./pages/CreateTournamentPage";
import CreateStreamPage from "./pages/CreateStreamPage";
import PaymentPage from "./pages/PaymentPage";
import InvitePage from "./pages/InvitePage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/users" element={<UserManagement currentUser={null} />} />
            <Route path="/join-tournament/:id" element={
              <AuthenticatedRoute>
                {(user) => <JoinTournamentPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/messages" element={
              <AuthenticatedRoute>
                {(user) => <MessagesPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/messages/:recipientId" element={
              <AuthenticatedRoute>
                {(user) => <MessagesPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/create-tournament" element={
              <AuthenticatedRoute>
                {(user) => <CreateTournamentPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/start-stream" element={
              <AuthenticatedRoute>
                {(user) => <CreateStreamPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/make-payment" element={
              <AuthenticatedRoute>
                {(user) => <PaymentPage user={user} />}
              </AuthenticatedRoute>
            } />
            <Route path="/invite-partner" element={
              <AuthenticatedRoute>
                {(user) => <InvitePage user={user} />}
              </AuthenticatedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
