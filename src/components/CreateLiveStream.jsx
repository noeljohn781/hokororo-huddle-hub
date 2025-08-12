import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Play, X } from "lucide-react";

interface Tournament {
  id: string;
  title: string;
}

interface CreateLiveStreamProps {
  user: User;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateLiveStream = ({ user, onClose, onSuccess }: CreateLiveStreamProps) => {
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [formData, setFormData] = useState({
    stream_title: "",
    stream_url: "",
    tournament_id: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("id, title")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tournaments:", error);
      } else {
        setTournaments(data || []);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("live_streams").insert({
        stream_title: formData.stream_title,
        stream_url: formData.stream_url,
        tournament_id: formData.tournament_id || null,
        is_active: true,
        viewer_count: 0,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Live stream created successfully!",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error creating live stream:", error);
      toast({
        title: "Error",
        description: "Failed to create live stream",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Create Live Stream
            </CardTitle>
            <CardDescription>Start streaming your tournament or match</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="stream_title">Stream Title*</Label>
            <Input
              id="stream_title"
              value={formData.stream_title}
              onChange={(e) => handleInputChange("stream_title", e.target.value)}
              placeholder="Enter stream title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stream_url">Stream URL*</Label>
            <Input
              id="stream_url"
              type="url"
              value={formData.stream_url}
              onChange={(e) => handleInputChange("stream_url", e.target.value)}
              placeholder="https://twitch.tv/your-stream or https://youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tournament_id">Associated Tournament (Optional)</Label>
            <Select value={formData.tournament_id} onValueChange={(value) => handleInputChange("tournament_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Tournament</SelectItem>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Start Stream"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLiveStream;