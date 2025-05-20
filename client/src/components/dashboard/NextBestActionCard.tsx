import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiLightbulbFlashLine, RiArrowRightLine, RiPhoneLine, RiTimeLine, RiVideoLine } from "react-icons/ri";

interface NextBestAction {
  id: number;
  action_type: string;
  description: string;
  priority: number;
  status: string;
}

interface NextBestActionCardProps {
  action: NextBestAction;
  onActionComplete?: (actionId: number) => void;
}

export default function NextBestActionCard({ action, onActionComplete }: NextBestActionCardProps) {
  // Determine the icon and button text based on action type
  const getActionDetails = (type: string) => {
    switch(type) {
      case 'call_leads':
        return {
          icon: <RiPhoneLine className="h-5 w-5 mr-2" />,
          buttonText: 'Call Now',
          cardColor: 'border-l-4 border-l-orange-500'
        };
      case 'follow_up':
        return {
          icon: <RiTimeLine className="h-5 w-5 mr-2" />,
          buttonText: 'Schedule Follow-up',
          cardColor: 'border-l-4 border-l-blue-500'
        };
      case 'skill_development':
        return {
          icon: <RiVideoLine className="h-5 w-5 mr-2" />,
          buttonText: 'Watch Training',
          cardColor: 'border-l-4 border-l-green-500'
        };
      default:
        return {
          icon: <RiLightbulbFlashLine className="h-5 w-5 mr-2" />,
          buttonText: 'Take Action',
          cardColor: 'border-l-4 border-l-purple-500'
        };
    }
  };

  const { icon, buttonText, cardColor } = getActionDetails(action.action_type);

  return (
    <Card className={`shadow-md hover:shadow-lg transition-shadow ${cardColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center font-bold">
            <RiLightbulbFlashLine className="h-6 w-6 text-amber-500 mr-2" />
            Next Best Action
          </CardTitle>
          <div className="flex items-center text-sm">
            <span className="font-medium text-xs uppercase py-1 px-2 rounded-full bg-orange-100 text-orange-800">
              {action.priority === 1 ? "High Priority" : "Priority"}
            </span>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-500 mt-1">
          AI-recommended next steps to maximize your success
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{action.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="default" 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all" 
          onClick={() => onActionComplete && onActionComplete(action.id)}
        >
          <span className="flex items-center">
            {icon}
            {buttonText}
          </span>
          <RiArrowRightLine className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}