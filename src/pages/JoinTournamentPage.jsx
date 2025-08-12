import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Users, Trophy, DollarSign, ArrowLeft } from "lucide-react";
import MobileMoneyPayment from "@/components/MobileMoneyPayment";
import MobileLayout from "@/components/MobileLayout";

interface Tournament {
  id: string;
  title: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  status: string;
  created_by: string;
}

interface JoinTournamentPageProps {
  user: User;
}

const JoinTournamentPage = ({ user }: JoinTournamentPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTournament();
      checkIfAlreadyJoined();
    }
  }, [id, user.id]);

  const fetchTournament = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load tournament details",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setTournament(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tournament details",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const checkIfAlreadyJoined = async () => {
    try {
      const { data, error } = await supabase
        .from("tournament_participants")
        .select("id")
        .eq("tournament_id", id)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setAlreadyJoined(true);
      }
    } catch (error) {
      // User hasn't joined yet
    }
  };

  const handleJoinTournament = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setAlreadyJoined(true);
    setShowPayment(false);
    setTournament(prev => prev ? { ...prev, current_participants: prev.current_participants + 1 } : null);
    
    toast({
      title: "Welcome to the Tournament! 🎉",
      description: "You have successfully joined the tournament. Good luck!",
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  if (loading) {
    return (
      <MobileLayout user={user} title="Loading..." showBackButton onBack={() => navigate("/")}>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileLayout>
    );
  }

  if (!tournament) {
    return (
      <MobileLayout user={user} title="Tournament Not Found" showBackButton onBack={() => navigate("/")}>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Tournament not found</h2>
            <Button onClick={() => navigate("/")} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const isTournamentFull = tournament.current_participants >= tournament.max_participants;
  const canJoin = !alreadyJoined && !isTournamentFull && tournament.status === "upcoming";

  if (showPayment && tournament) {
    return (
      <MobileLayout user={user} title="Payment" showBackButton onBack={handlePaymentCancel}>
        <div className="p-4">
          <MobileMoneyPayment
            user={user}
            tournamentId={tournament.id}
            amount={tournament.entry_fee}
            tournamentTitle={tournament.title}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout user={user} title={tournament.title} showBackButton onBack={() => navigate("/")}>
      <div className="p-4 space-y-6">

        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Badge 
                variant={tournament.status === "upcoming" ? "secondary" : "outline"}
                className="text-sm"
              >
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </Badge>
            </div>
            {tournament.description && (
              <p className="text-muted-foreground text-base">{tournament.description}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tournament Details - Mobile Optimized */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Entry Fee</p>
                  <p className="text-sm font-bold">Tsh {Math.round(tournament.entry_fee * 2500).toLocaleString()}</p>
                </div>

                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                  <p className="text-sm font-bold">Tsh {Math.round(tournament.prize_pool * 2500).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <Users className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Participants</p>
                  <p className="text-sm font-bold">
                    {tournament.current_participants} / {tournament.max_participants}
                  </p>
                </div>

                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-bold">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Join Tournament Section - Mobile Optimized */}
            <div className="space-y-4">
              {alreadyJoined ? (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
                  <h3 className="text-base font-semibold text-success">Already Joined! ✅</h3>
                  <p className="text-sm text-muted-foreground">You are registered for this tournament.</p>
                </div>
              ) : isTournamentFull ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                  <h3 className="text-base font-semibold text-destructive">Tournament Full</h3>
                  <p className="text-sm text-muted-foreground">This tournament has reached maximum capacity.</p>
                </div>
              ) : tournament.status !== "upcoming" ? (
                <div className="p-4 bg-muted border rounded-lg text-center">
                  <h3 className="text-base font-semibold">Tournament Not Available</h3>
                  <p className="text-sm text-muted-foreground">This tournament is no longer accepting participants.</p>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <h3 className="text-lg font-semibold">Ready to Join? ⚽</h3>
                  <p className="text-muted-foreground">
                    Entry fee: <span className="font-semibold text-primary">Tsh {Math.round(tournament.entry_fee * 2500).toLocaleString()}</span>
                  </p>
                  <Button
                    size="lg"
                    onClick={handleJoinTournament}
                    disabled={joining || !canJoin}
                    className="w-full h-12 mobile-transition"
                  >
                    {joining ? "Processing..." : `Join Tournament - Tsh ${Math.round(tournament.entry_fee * 2500).toLocaleString()}`}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default JoinTournamentPage;