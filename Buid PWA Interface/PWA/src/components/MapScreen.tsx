import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, AlertCircle } from "lucide-react";

export function MapScreen() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 space-y-3">
        <h2>Risk Map</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search location..." 
            className="pl-10 rounded-full border-2"
          />
        </div>
      </div>
      
      <div className="flex-1 relative bg-gray-100 border-y">
        <div className="absolute inset-0 p-4">
          <svg className="w-full h-full" viewBox="0 0 300 400">
            <rect x="0" y="0" width="300" height="400" fill="#F3F4F6" />
            
            {/* Roads */}
            <path d="M 50 0 L 50 400" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 150 0 L 150 400" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 250 0 L 250 400" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 100 L 300 100" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 200 L 300 200" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M 0 300 L 300 300" stroke="#D1D5DB" strokeWidth="2" />
            
            {/* Risk zones */}
            <polygon points="80,120 140,100 160,150 110,170" fill="rgba(239, 68, 68, 0.3)" stroke="#EF4444" strokeWidth="2" />
            <polygon points="200,240 260,220 270,280 220,300" fill="rgba(251, 146, 60, 0.3)" stroke="#FB923C" strokeWidth="2" />
            <polygon points="60,280 120,270 130,340 70,350" fill="rgba(250, 204, 21, 0.3)" stroke="#FACC15" strokeWidth="2" />
            
            {/* Current location */}
            <circle cx="150" cy="200" r="8" fill="#1A73E8" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>
      
      <Button 
        size="lg"
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 p-0 shadow-xl"
      >
        <AlertCircle className="w-8 h-8" />
      </Button>
    </div>
  );
}
