import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Play, Users, Zap, Star, GamepadIcon, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GamepadIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">E-Football Hub</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to E-Football Hub
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The ultimate destination for competitive e-football gaming. Join tournaments, 
              stream your matches live, connect with players worldwide, and compete for amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-4">
                Join the Competition
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8 py-4">
                Watch Live Streams
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose E-Football Hub?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-12 h-12 text-success mb-4" />
                <CardTitle>Competitive Tournaments</CardTitle>
                <CardDescription>
                  Join exciting tournaments with real prize pools and compete against the best players
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Play className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Live Streaming</CardTitle>
                <CardDescription>
                  Stream your matches live and watch other players in real-time with interactive features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Global Community</CardTitle>
                <CardDescription>
                  Connect with players worldwide, find partners, and build lasting gaming relationships
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Real-time Features</CardTitle>
                <CardDescription>
                  Experience lag-free gaming with our optimized platform and real-time chat system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="w-12 h-12 text-success mb-4" />
                <CardTitle>Skill-based Matching</CardTitle>
                <CardDescription>
                  Get matched with players of similar skill levels for fair and competitive gameplay
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Interactive Chat</CardTitle>
                <CardDescription>
                  Chat with other players, share strategies, and build your gaming network
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-primary mb-2">10K+</h4>
              <p className="text-muted-foreground">Active Players</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-success mb-2">500+</h4>
              <p className="text-muted-foreground">Tournaments Hosted</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-secondary mb-2">$50K+</h4>
              <p className="text-muted-foreground">Prize Money Awarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Start Your E-Football Journey?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players already competing in our tournaments and streaming their matches.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-4">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 E-Football Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;