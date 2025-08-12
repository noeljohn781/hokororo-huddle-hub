import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import PrivateChat from "@/components/PrivateChat";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

interface MessagesPageProps {
  user: User;
}

const MessagesPage = ({ user }: MessagesPageProps) => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (recipientId && profiles.length > 0) {
      const recipient = profiles.find(p => p.id === recipientId);
      if (recipient) {
        setSelectedRecipient(recipient);
      }
    }
  }, [recipientId, profiles]);

  useEffect(() => {
    const filtered = profiles.filter(profile =>
      profile.id !== user.id && 
      (profile.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProfiles(filtered);
  }, [profiles, searchTerm, user.id]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .neq("id", user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (profile: Profile) => {
    setSelectedRecipient(profile);
    navigate(`/messages/${profile.id}`);
  };

  const handleCloseChat = () => {
    setSelectedRecipient(null);
    navigate("/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredProfiles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    {searchTerm ? "No users found" : "No other users available"}
                  </p>
                ) : (
                  filteredProfiles.map((profile) => (
                    <Button
                      key={profile.id}
                      variant={selectedRecipient?.id === profile.id ? "secondary" : "ghost"}
                      className="w-full justify-start p-3 h-auto"
                      onClick={() => handleStartChat(profile)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          {profile.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{profile.username}</div>
                          {profile.full_name && (
                            <div className="text-sm text-muted-foreground">
                              {profile.full_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedRecipient ? (
              <PrivateChat
                user={user}
                recipientId={selectedRecipient.id}
                recipientEmail={selectedRecipient.username}
                onClose={handleCloseChat}
              />
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Select a user to start chatting
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;