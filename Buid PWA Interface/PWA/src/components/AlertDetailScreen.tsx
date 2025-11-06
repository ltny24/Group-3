import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { CheckCircle2, XCircle, Share2, Check, ChevronLeft } from "lucide-react";

export function AlertDetailScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <ChevronLeft className="w-6 h-6" />
          <h2>Alert Details</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="h-40 bg-gray-200 relative">
          <svg className="w-full h-full" viewBox="0 0 375 160">
            <rect x="0" y="0" width="375" height="160" fill="#E5E7EB" />
            <path d="M 60 0 L 60 160" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 187.5 0 L 187.5 160" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 315 0 L 315 160" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 40 L 375 40" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 80 L 375 80" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 120 L 375 120" stroke="#D1D5DB" strokeWidth="2" />
            <polygon points="150,50 220,40 240,90 170,110" fill="rgba(239, 68, 68, 0.4)" stroke="#EF4444" strokeWidth="2" />
            <circle cx="187.5" cy="80" r="8" fill="#1A73E8" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2>Severe Storm Warning</h2>
              <Badge className="bg-red-500 text-white border-0">Critical</Badge>
            </div>
            <p className="text-gray-600">Heavy rainfall and strong winds expected in your area. Please stay indoors and avoid unnecessary travel.</p>
          </div>
          
          <Card className="p-4 rounded-2xl bg-green-50 border-green-200">
            <div className="flex items-start gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-green-900">What to do</h3>
            </div>
            <ul className="space-y-2 ml-7">
              <li className="flex items-start gap-2 text-sm text-green-900">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Stay indoors in a safe location</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-900">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Keep emergency contacts ready</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-900">
                <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Monitor weather updates regularly</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-4 rounded-2xl bg-red-50 border-red-200">
            <div className="flex items-start gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-red-900">What not to do</h3>
            </div>
            <ul className="space-y-2 ml-7">
              <li className="flex items-start gap-2 text-sm text-red-900">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Don't go outside unless necessary</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-900">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Avoid using electrical appliances</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-red-900">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Don't drive through flooded areas</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t space-y-2">
        <Button className="w-full bg-[#1A73E8] hover:bg-[#1557b0] rounded-full h-12">
          Mark as Read
        </Button>
        <Button variant="outline" className="w-full rounded-full h-12 border-2">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
