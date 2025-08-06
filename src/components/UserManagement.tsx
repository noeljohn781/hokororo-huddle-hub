import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Users, UserPlus, Calendar, Mail, Trophy } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  created_at: string;
  total_wins: number;
  total_losses: number;
  earnings: number;
  country: string;
  skill_level: string;
}

interface UserManagementProps {
  currentUser: User;
}

const UserManagement = ({ currentUser }: UserManagementProps) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Get all user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
        return;
      }

      setProfiles(profilesData || []);
      setUserCount(profilesData?.length || 0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userCount}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Week</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {profiles.filter(p => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(p.created_at) > oneWeekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Past 7 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {profiles.filter(p => (p.total_wins + p.total_losses) > 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                With match history
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Accounts
            </CardTitle>
            <CardDescription>
              All registered users in the E-Football Hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{profile.username}</p>
                      {profile.full_name && (
                        <p className="text-sm text-muted-foreground">{profile.full_name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Joined {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {profile.total_wins}W
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {profile.total_losses}L
                        </Badge>
                      </div>
                      {profile.earnings > 0 && (
                        <p className="text-xs text-success font-medium mt-1">
                          ${profile.earnings}
                        </p>
                      )}
                    </div>
                    {profile.skill_level && (
                      <Badge variant={profile.skill_level === 'professional' ? 'default' : 'secondary'}>
                        {profile.skill_level}
                      </Badge>
                    )}
                    {profile.country && (
                      <Badge variant="outline">
                        {profile.country}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {profiles.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;