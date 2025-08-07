import React from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateTournament from "@/components/CreateTournament";

interface CreateTournamentPageProps {
  user: User;
}

const CreateTournamentPage = ({ user }: CreateTournamentPageProps) => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary">Create Tournament</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <CreateTournament 
          user={user} 
          onClose={() => navigate(-1)}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default CreateTournamentPage;