-- Create payments table to track custom payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invitations table for partner invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  invitation_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(8), 'base64'),
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Edge functions can update payments" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Invitations policies
CREATE POLICY "Users can view their sent invitations" 
ON public.invitations 
FOR SELECT 
USING (auth.uid() = inviter_id);

CREATE POLICY "Users can view invitations sent to them" 
ON public.invitations 
FOR SELECT 
USING (invitee_email = auth.email());

CREATE POLICY "Users can create invitations" 
ON public.invitations 
FOR INSERT 
WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update invitations they received" 
ON public.invitations 
FOR UPDATE 
USING (invitee_email = auth.email());

-- Add triggers for updated_at columns
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_invitations_email ON public.invitations(invitee_email);
CREATE INDEX idx_invitations_code ON public.invitations(invitation_code);
CREATE INDEX idx_payments_user ON public.payments(user_id);