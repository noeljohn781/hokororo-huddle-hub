import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  MessageCircle, 
  Play, 
  Globe, 
  Zap,
  Target,
  Crown
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: "Competitive Tournaments",
      description: "Join exciting tournaments with skilled players from around the world and compete for prizes."
    },
    {
      icon: Play,
      title: "Live Streaming",
      description: "Watch live matches and streams, or broadcast your own gameplay to a global audience."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with e-football players worldwide, make friends, and build your network."
    },
    {
      icon: Zap,
      title: "Real-time Features",
      description: "Experience instant chat, live updates, and real-time tournament brackets."
    },
    {
      icon: Target,
      title: "Skill-based Matching",
      description: "Get matched with players of similar skill levels for fair and exciting competitions."
    },
    {
      icon: MessageCircle,
      title: "Interactive Chat",
      description: "Chat with other players, discuss strategies, and build lasting friendships."
    }
  ];

  const stats = [
    { label: "Active Players", value: "10,000+" },
    { label: "Tournaments Hosted", value: "500+" },
    { label: "Prize Money Awarded", value: "$50,000+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 dark:from-background dark:via-muted/10 dark:to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              E-Football Hub
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="text-foreground/80 hover:text-foreground"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <Badge 
          variant="secondary" 
          className="mb-6 bg-primary/10 text-primary border-primary/20"
        >
          Welcome to the Future of E-Football
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
          Your Gateway to Competitive Digital Football
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          E-Football Hub is your gateway to competitive digital football. Watch live games, 
          join tournaments, and connect with players across the globe. Are you ready to make your mark?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-3"
          >
            Join Competitions
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate("/auth")}
            className="border-primary/30 text-primary hover:bg-primary/10 text-lg px-8 py-3"
          >
            Watch Live Streams
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose E-Football Hub?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the ultimate e-football platform with cutting-edge features designed for serious players.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your E-Football Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players competing in tournaments, streaming matches, and building the future of digital football.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-12 py-4"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2024 E-Football Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;