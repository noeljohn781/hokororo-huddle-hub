-- Create chat messages table
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  message text NOT NULL,
  tournament_id uuid NULL,
  stream_id uuid NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Anyone can view chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update tournaments table to allow users to create tournaments
-- (The table already exists but we need to update the created_by field logic)
UPDATE public.tournaments SET created_by = NULL WHERE created_by IS NULL;

-- Add realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;