import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Trophy, Users, Play, ArrowLeft, Settings, CreditCard, UserPlus, MessageCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import InvitePartner from "./InvitePartner";
import ChatBox from "./ChatBox";
import CreateTournament from "./CreateTournament";
import CreateLiveStream from "./CreateLiveStream";
import MobileLayout from "./MobileLayout";

// Removed TypeScript interfaces for JavaScript

const Dashboard = ({ user, onSignOut }) => {
  const [tournaments, setTournaments] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showCreateStream, setShowCreateStream] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tournamentsResult, streamsResult] = await Promise.all([
        supabase.from("tournaments").select("*").order("start_date", { ascending: true }),
        supabase.from("live_streams").select("*").eq("is_active", true)
      ]);

      if (tournamentsResult.data) setTournaments(tournamentsResult.data);
      if (streamsResult.data) setLiveStreams(streamsResult.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const joinTournament = async (tournamentId) => {
    try {
      const { error } = await supabase
        .from("tournament_participants")
        .insert({ tournament_id: tournamentId, user_id: user.id });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Successfully joined tournament!",
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join tournament",
        variant: "destructive",
      });
    }
  };

  const joinStream = async (streamId) => {
    try {
      const { error } = await supabase
        .from("stream_viewers")
        .insert({ stream_id: streamId, user_id: user.id });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Joined live stream!",
        });
        fetchData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join stream",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <MobileLayout user={user} showBottomNav={false}>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout user={user} title="E-Football Hub">
      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate('/make-payment')} 
            className="flex flex-col items-center gap-2 h-20 mobile-transition"
            size="lg"
          >
            <CreditCard className="w-6 h-6" />
            <span className="text-sm">Make Payment</span>
          </Button>
          <Button 
            onClick={() => navigate('/invite-partner')} 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-20 mobile-transition"
            size="lg"
          >
            <UserPlus className="w-6 h-6" />
            <span className="text-sm">Invite Partner</span>
          </Button>
        </div>

        {showPaymentForm && (
          <div className="mb-6">
            <PaymentForm user={user} onClose={() => setShowPaymentForm(false)} />
          </div>
        )}

        {showInviteForm && (
          <div className="mb-6">
            <InvitePartner user={user} />
          </div>
        )}

        {showCreateTournament && (
          <div className="mb-6">
            <CreateTournament 
              user={user} 
              onClose={() => setShowCreateTournament(false)}
              onSuccess={fetchData}
            />
          </div>
        )}

        {showCreateStream && (
          <div className="mb-6">
            <CreateLiveStream 
              user={user} 
              onClose={() => setShowCreateStream(false)}
              onSuccess={fetchData}
            />
          </div>
        )}

        {showChat && (
          <div className="mb-6">
            <ChatBox user={user} title="General Chat" />
          </div>
        )}

        <Tabs defaultValue="tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tournaments" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Live Streams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tournament.title}</CardTitle>
                      <Badge variant={tournament.status === "upcoming" ? "default" : "secondary"}>
                        {tournament.status}
                      </Badge>
                    </div>
                    <CardDescription>{tournament.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(tournament.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {tournament.current_participants}/{tournament.max_participants}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Prize Pool</p>
                        <p className="font-bold text-success">${tournament.prize_pool}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Entry Fee</p>
                        <p className="font-bold">${tournament.entry_fee}</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/join-tournament/${tournament.id}`)}
                      disabled={tournament.current_participants >= tournament.max_participants}
                    >
                      {tournament.current_participants >= tournament.max_participants ? "Full" : "Join Tournament"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveStreams.map((stream) => (
                <Card key={stream.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      {stream.stream_title}
                    </CardTitle>
                    <CardDescription>Live now</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {stream.viewer_count} viewers
                      </span>
                      <span className="text-muted-foreground">
                        Started {new Date(stream.started_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90" 
                      onClick={() => joinStream(stream.id)}
                    >
                      Watch Stream
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {liveStreams.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No live streams at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;