import { Button } from "./ui/button";
import { Shield, Bell, WifiOff } from "lucide-react";

export function OnboardingScreen() {
  return (
    <div className="flex flex-col items-center justify-between h-full bg-white p-6">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-blue-50 flex items-center justify-center">
          <Shield className="w-24 h-24 text-[#1A73E8]" strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="space-y-6 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-[#1A73E8]">Travel Safety System</h1>
          <p className="text-gray-600">Stay safe wherever you go</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Real-time Alerts</h3>
              <p className="text-gray-600">Get instant notifications about safety risks</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>SOS Support</h3>
              <p className="text-gray-600">Emergency assistance at your fingertips</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Offline Mode</h3>
              <p className="text-gray-600">Access critical info without internet</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-[#1A73E8] hover:bg-[#1557b0] rounded-full h-12">
          Get Started
        </Button>
      </div>
    </div>
  );
}
