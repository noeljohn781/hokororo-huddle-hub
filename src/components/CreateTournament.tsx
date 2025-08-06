import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Calendar, Trophy, X } from "lucide-react";

interface CreateTournamentProps {
  user: User;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateTournament = ({ user, onClose, onSuccess }: CreateTournamentProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    max_participants: "16",
    entry_fee: "",
    prize_pool: "",
    tournament_type: "single_elimination",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("tournaments").insert({
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        max_participants: parseInt(formData.max_participants),
        entry_fee: parseFloat(formData.entry_fee) || 0,
        prize_pool: parseFloat(formData.prize_pool) || 0,
        tournament_type: formData.tournament_type,
        created_by: user.id,
        status: "upcoming",
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
          description: "Tournament created successfully!",
        });
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to create tournament",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Create Tournament
            </CardTitle>
            <CardDescription>Set up a new tournament for players to join</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tournament Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter tournament name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tournament_type">Tournament Type</Label>
              <Select value={formData.tournament_type} onValueChange={(value) => handleInputChange("tournament_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_elimination">Single Elimination</SelectItem>
                  <SelectItem value="double_elimination">Double Elimination</SelectItem>
                  <SelectItem value="round_robin">Round Robin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your tournament..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date*</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_participants">Max Players</Label>
              <Select value={formData.max_participants} onValueChange={(value) => handleInputChange("max_participants", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Max players" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 Players</SelectItem>
                  <SelectItem value="16">16 Players</SelectItem>
                  <SelectItem value="32">32 Players</SelectItem>
                  <SelectItem value="64">64 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry_fee">Entry Fee ($)</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.entry_fee}
                onChange={(e) => handleInputChange("entry_fee", e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prize_pool">Prize Pool ($)</Label>
              <Input
                id="prize_pool"
                type="number"
                step="0.01"
                min="0"
                value={formData.prize_pool}
                onChange={(e) => handleInputChange("prize_pool", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Tournament"}
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

export default CreateTournament;