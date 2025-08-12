import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { 
  Smartphone, 
  Phone, 
  Wallet,
  ArrowLeft 
} from "lucide-react";

interface MobileMoneyPaymentProps {
  user: User;
  tournamentId: string;
  amount: number;
  tournamentTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MobileMoneyPayment = ({ 
  user, 
  tournamentId, 
  amount, 
  tournamentTitle, 
  onSuccess, 
  onCancel 
}: MobileMoneyPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Convert amount to TSH (assuming 1 USD = 2500 TSH)
  const amountTSH = Math.round(amount * 2500);

  const mobileMoneyProviders = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: "📱",
      color: "bg-green-100 border-green-300 text-green-800"
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: "📶",
      color: "bg-red-100 border-red-300 text-red-800"
    },
    {
      id: "tigo",
      name: "Mix by Yas (Tigo Pesa)",
      icon: "💳",
      color: "bg-blue-100 border-blue-300 text-blue-800"
    },
    {
      id: "halopesa",
      name: "HaloPesa",
      icon: "🏪",
      color: "bg-purple-100 border-purple-300 text-purple-800"
    }
  ];

  const validatePhoneNumber = (phone: string) => {
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s-()]/g, "");
    
    // Check if starts with 0 or +255
    if (cleanPhone.startsWith("0") && cleanPhone.length === 10) {
      return true;
    }
    if (cleanPhone.startsWith("+255") && cleanPhone.length === 13) {
      return true;
    }
    if (cleanPhone.startsWith("255") && cleanPhone.length === 12) {
      return true;
    }
    
    return false;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/[\s-()]/g, "");
    
    if (cleanPhone.startsWith("0")) {
      return "+255" + cleanPhone.slice(1);
    }
    if (cleanPhone.startsWith("255")) {
      return "+" + cleanPhone;
    }
    if (cleanPhone.startsWith("+255")) {
      return cleanPhone;
    }
    
    return phone;
  };

  const handlePayment = async () => {
    if (!selectedProvider) {
      toast({
        title: "Provider Required",
        description: "Please select a mobile money provider",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Tanzanian phone number (starting with 0 or +255)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Create payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount: amountTSH,
          currency: "TZS",
          payment_method: selectedProvider,
          description: `Entry fee for tournament: ${tournamentTitle} - Phone: ${formattedPhone}`,
          status: "pending"
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      // Simulate mobile money push notification
      toast({
        title: "Payment Request Sent",
        description: `Check your ${mobileMoneyProviders.find(p => p.id === selectedProvider)?.name} for payment confirmation`,
      });

      // Simulate successful payment after 3 seconds
      setTimeout(async () => {
        try {
          // Update payment status
          await supabase
            .from("payments")
            .update({ status: "completed" })
            .eq("id", paymentData.id);

          // Payment record already exists, just update if needed

          // Join tournament
          await supabase
            .from("tournament_participants")
            .insert({
              tournament_id: tournamentId,
              user_id: user.id,
              payment_status: "completed"
            });

          // Update tournament participant count
          const { data: currentTournament } = await supabase
            .from("tournaments")
            .select("current_participants")
            .eq("id", tournamentId)
            .single();

          if (currentTournament) {
            await supabase
              .from("tournaments")
              .update({
                current_participants: currentTournament.current_participants + 1
              })
              .eq("id", tournamentId);
          }

          toast({
            title: "Payment Successful! 🎉",
            description: `Payment sent to THOMAS, JOHN NOEL (70610065869). You've joined the tournament!`,
          });

          onSuccess?.();
        } catch (error) {
          console.error("Error completing payment:", error);
          toast({
            title: "Payment Error",
            description: "Payment was received but there was an error joining the tournament. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile Money Payment
            </CardTitle>
            <CardDescription>
              Pay Tsh {amountTSH.toLocaleString()} for {tournamentTitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Tournament:</span>
              <span className="font-medium">{tournamentTitle}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">Tsh {amountTSH.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipient:</span>
              <span className="font-medium">THOMAS, JOHN NOEL</span>
            </div>
            <div className="flex justify-between">
              <span>Account:</span>
              <span className="font-medium">70610065869</span>
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>Select Mobile Money Provider</Label>
          <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider}>
            {mobileMoneyProviders.map((provider) => (
              <div key={provider.id} className="flex items-center space-x-2">
                <RadioGroupItem value={provider.id} id={provider.id} />
                <Label 
                  htmlFor={provider.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer flex-1 ${
                    selectedProvider === provider.id ? provider.color : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="text-2xl">{provider.icon}</span>
                  <span className="font-medium">{provider.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Mobile Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0xxxxxxxxx or +255xxxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter your phone number starting with 0 or +255
          </p>
        </div>

        {/* Payment Button */}
        <Button 
          onClick={handlePayment} 
          disabled={loading || !selectedProvider || !phoneNumber}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Pay Tsh {amountTSH.toLocaleString()}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You will receive a payment prompt on your phone. Complete the payment to join the tournament.
        </p>
      </CardContent>
    </Card>
  );
};

export default MobileMoneyPayment;