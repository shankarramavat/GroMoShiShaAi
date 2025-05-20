import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RiPhoneLine, 
  RiWhatsappLine, 
  RiLightbulbFlashFill,
  RiArrowRightUpLine
} from "react-icons/ri";

interface Lead {
  id: number;
  name: string;
  phone_number: string;
  product_interest: string[] | null;
  ai_match_score: number | null;
  ai_pitch_tip: string | null;
}

interface AILeadMatchCardProps {
  lead: Lead;
  onCallClick?: (leadId: number) => void;
  onWhatsAppClick?: (leadId: number) => void;
  onViewDetailsClick?: (leadId: number) => void;
}

export default function AILeadMatchCard({ 
  lead, 
  onCallClick, 
  onWhatsAppClick, 
  onViewDetailsClick 
}: AILeadMatchCardProps) {
  // Format phone number for WhatsApp (remove spaces and add country code if needed)
  const formatWhatsAppNumber = (phone: string) => {
    // Remove any non-numeric characters
    const numericPhone = phone.replace(/\D/g, '');
    
    // If it doesn't start with "+", add India's code
    if (!phone.startsWith('+')) {
      return `+91${numericPhone}`;
    }
    
    return numericPhone;
  };

  // Generate WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    const formattedPhone = formatWhatsAppNumber(phone);
    return `https://wa.me/${formattedPhone}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20I'm%20your%20GroMo%20Partner.%20I'd%20like%20to%20discuss%20financial%20products%20that%20might%20interest%20you.`;
  };

  // Calculate badge color based on match score
  const getMatchBadgeColor = (score: number | null) => {
    if (!score) return "bg-gray-100 text-gray-800";
    
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-emerald-100 text-emerald-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold">
            {lead.name}
          </CardTitle>
          <Badge className={`${getMatchBadgeColor(lead.ai_match_score)}`}>
            {lead.ai_match_score ? `${lead.ai_match_score}% Match` : 'No Score'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {lead.phone_number}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {lead.product_interest?.map((interest, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {lead.ai_pitch_tip && (
          <div className="bg-amber-50 p-3 rounded-md mb-3">
            <div className="flex items-start">
              <RiLightbulbFlashFill className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700">{lead.ai_pitch_tip}</p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onCallClick && onCallClick(lead.id)}
          >
            <RiPhoneLine className="h-4 w-4 mr-1" />
            Call
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(getWhatsAppLink(lead.phone_number), '_blank')}
          >
            <RiWhatsappLine className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetailsClick && onViewDetailsClick(lead.id)}
          >
            <RiArrowRightUpLine className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}