import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { UserPlus, Mail, Copy, ExternalLink } from "lucide-react";

interface Tournament {
  id: string;
  title: string;
  status: string;
}

interface Invitation {
  id: string;
  invitee_email: string;
  tournament_id: string;
  invitation_code: string;
  status: string;
  expires_at: string;
  tournaments: {
    title: string;
  };
}

interface InvitePartnerProps {
  user: User;
}

const InvitePartner = ({ user }: InvitePartnerProps) => {
  const [email, setEmail] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tournamentsResult, invitationsResult] = await Promise.all([
        supabase
          .from("tournaments")
          .select("id, title, status")
          .eq("status", "upcoming")
          .order("start_date", { ascending: true }),
        supabase
          .from("invitations")
          .select(`
            *,
            tournaments(title)
          `)
          .eq("inviter_id", user.id)
          .order("created_at", { ascending: false })
      ]);

      if (tournamentsResult.data) setTournaments(tournamentsResult.data);
      if (invitationsResult.data) setInvitations(invitationsResult.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    }
    setLoadingData(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !selectedTournament) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("invitations")
        .insert({
          inviter_id: user.id,
          invitee_email: email,
          tournament_id: selectedTournament
        })
        .select(`
          *,
          tournaments(title)
        `)
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${email} successfully`,
      });

      // Add to local state
      if (data) {
        setInvitations(prev => [data, ...prev]);
      }

      // Reset form
      setEmail("");
      setSelectedTournament("");
    } catch (error: any) {
      toast({
        title: "Invitation Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyInvitationLink = (code: string) => {
    const link = `${window.location.origin}/invite/${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Invitation link copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-accent text-accent-foreground";
      case "pending":
        return "bg-success text-success-foreground";
      case "expired":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (loadingData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Partner
          </CardTitle>
          <CardDescription>
            Invite a partner to join a tournament with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Partner's Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournament">Tournament</Label>
              <Select value={selectedTournament} onValueChange={setSelectedTournament}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading || tournaments.length === 0} className="w-full">
              {loading ? "Sending..." : "Send Invitation"}
            </Button>

            {tournaments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No upcoming tournaments available for invitations
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sent Invitations</CardTitle>
            <CardDescription>
              Manage your sent invitations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{invitation.invitee_email}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.tournaments?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(invitation.status)}>
                    {invitation.status}
                  </Badge>
                  {invitation.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyInvitationLink(invitation.invitation_code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvitePartner;