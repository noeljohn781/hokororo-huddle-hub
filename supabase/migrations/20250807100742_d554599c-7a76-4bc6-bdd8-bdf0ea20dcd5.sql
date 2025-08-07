-- Create private_messages table for user-to-user messaging
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for private messages
CREATE POLICY "Users can view messages they sent or received" 
ON public.private_messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create their own messages" 
ON public.private_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" 
ON public.private_messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" 
ON public.private_messages 
FOR DELETE 
USING (auth.uid() = sender_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_private_messages_updated_at
BEFORE UPDATE ON public.private_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for private messages
ALTER TABLE public.private_messages REPLICA IDENTITY FULL;