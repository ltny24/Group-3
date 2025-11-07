import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Map, Bell, AlertCircle, Home, User, Settings } from "lucide-react";

export function HomeScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2>Good morning, Alex</h2>
          <p className="text-gray-600">Stay safe today</p>
        </div>
        
        <Card className="p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs">☀️</span>
            </div>
            <span className="text-sm">Ho Chi Minh City</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl">28°C</span>
              </div>
              <p className="text-sm text-gray-600">Partly Cloudy</p>
            </div>
            <div className="text-sm text-gray-600">
              <div>H: 32° L: 24°</div>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#1A73E8"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70 * 0.85} ${2 * Math.PI * 70}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl text-[#1A73E8]">85</span>
              <span className="text-sm text-gray-600">Safety Score</span>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">Good conditions</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl border-2">
            <Map className="w-6 h-6 text-[#1A73E8]" />
            <span className="text-sm">Map</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl border-2">
            <Bell className="w-6 h-6 text-[#1A73E8]" />
            <span className="text-sm">Alerts</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2 rounded-2xl border-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="text-sm">SOS</span>
          </Button>
        </div>
      </div>
      
      <div className="border-t bg-white">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center gap-1 text-[#1A73E8]">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-gray-400">
            <Map className="w-5 h-5" />
            <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-gray-400">
            <Bell className="w-5 h-5" />
            <span className="text-xs">Alerts</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-gray-400">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
