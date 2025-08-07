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

  const handleJoinTournament = async () => {
    if (!tournament || alreadyJoined) return;

    setJoining(true);

    try {
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount: tournament.entry_fee,
          currency: "USD",
          description: `Entry fee for tournament: ${tournament.title}`,
          status: "completed",
          payment_method: "card"
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // Join tournament
      const { error: participantError } = await supabase
        .from("tournament_participants")
        .insert({
          tournament_id: tournament.id,
          user_id: user.id,
          payment_status: "completed"
        });

      if (participantError) {
        throw participantError;
      }

      // Update tournament participant count
      const { error: updateError } = await supabase
        .from("tournaments")
        .update({
          current_participants: tournament.current_participants + 1
        })
        .eq("id", tournament.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success!",
        description: "You have successfully joined the tournament!",
      });

      setAlreadyJoined(true);
      setTournament(prev => prev ? { ...prev, current_participants: prev.current_participants + 1 } : null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Tournament not found</h2>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isTournamentFull = tournament.current_participants >= tournament.max_participants;
  const canJoin = !alreadyJoined && !isTournamentFull && tournament.status === "upcoming";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">{tournament.title}</CardTitle>
              <Badge 
                variant={tournament.status === "upcoming" ? "secondary" : "outline"}
                className="text-sm"
              >
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </Badge>
            </div>
            {tournament.description && (
              <p className="text-muted-foreground text-lg">{tournament.description}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tournament Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-lg font-semibold">${tournament.entry_fee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-lg font-semibold">${tournament.prize_pool}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-lg font-semibold">
                      {tournament.current_participants} / {tournament.max_participants}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(tournament.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {tournament.end_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="text-lg font-semibold">
                        {new Date(tournament.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Join Tournament Section */}
            <div className="text-center space-y-4">
              {alreadyJoined ? (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-success">Already Joined!</h3>
                  <p className="text-muted-foreground">You are registered for this tournament.</p>
                </div>
              ) : isTournamentFull ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-destructive">Tournament Full</h3>
                  <p className="text-muted-foreground">This tournament has reached maximum capacity.</p>
                </div>
              ) : tournament.status !== "upcoming" ? (
                <div className="p-4 bg-muted border rounded-lg">
                  <h3 className="text-lg font-semibold">Tournament Not Available</h3>
                  <p className="text-muted-foreground">This tournament is no longer accepting participants.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Ready to Join?</h3>
                  <p className="text-muted-foreground">
                    Entry fee: <span className="font-semibold">${tournament.entry_fee}</span>
                  </p>
                  <Button
                    size="lg"
                    onClick={handleJoinTournament}
                    disabled={joining || !canJoin}
                    className="px-8"
                  >
                    {joining ? "Processing..." : `Join Tournament - $${tournament.entry_fee}`}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinTournamentPage;