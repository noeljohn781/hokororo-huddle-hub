import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  tournament_id?: string | null;
  stream_id?: string | null;
  created_at: string;
  profiles?: {
    username: string;
  } | null;
}

interface ChatBoxProps {
  user: User;
  tournamentId?: string;
  streamId?: string;
  title?: string;
}

const ChatBox = ({ user, tournamentId, streamId, title = "Chat" }: ChatBoxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    setupRealtimeSubscription();
  }, [tournamentId, streamId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (tournamentId) {
        query = query.eq("tournament_id", tournamentId);
      } else if (streamId) {
        query = query.eq("stream_id", streamId);
      } else {
        query = query.is("tournament_id", null).is("stream_id", null);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // Only add messages for the current context
          if (
            (tournamentId && newMessage.tournament_id === tournamentId) ||
            (streamId && newMessage.stream_id === streamId) ||
            (!tournamentId && !streamId && !newMessage.tournament_id && !newMessage.stream_id)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        user_id: user.id,
        message: newMessage.trim(),
        tournament_id: tournamentId || null,
        stream_id: streamId || null,
      };

      const { error } = await supabase
        .from("chat_messages")
        .insert(messageData);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === user.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.user_id === user.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.user_id !== user.id && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                      User {message.user_id.slice(0, 8)}
                    </p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBox;