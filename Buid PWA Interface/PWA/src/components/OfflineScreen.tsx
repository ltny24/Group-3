import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { WifiOff, Download, MapPin, Bell, Info } from "lucide-react";

export function OfflineScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2>Offline Mode</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Card className="p-6 rounded-2xl text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          <h3>No Internet Connection</h3>
          <p className="text-gray-600 mt-2">
            You're currently offline. You can still access cached data and previously downloaded information.
          </p>
        </Card>
        
        <div>
          <h3 className="mb-3 text-gray-600">Cached Data</h3>
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Download Progress</span>
              <span className="text-sm text-[#1A73E8]">65%</span>
            </div>
            <Progress value={65} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">2.1 GB / 3.2 GB</p>
          </Card>
        </div>
        
        <div>
          <h3 className="mb-3 text-gray-600">Available Offline</h3>
          <Card className="rounded-2xl divide-y">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#1A73E8]" />
                </div>
                <div>
                  <h4>Offline Maps</h4>
                  <p className="text-sm text-gray-600">Ho Chi Minh City</p>
                </div>
              </div>
              <CheckIcon />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4>Cached Alerts</h4>
                  <p className="text-sm text-gray-600">12 alerts saved</p>
                </div>
              </div>
              <CheckIcon />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4>Safety Guidelines</h4>
                  <p className="text-sm text-gray-600">All tips available</p>
                </div>
              </div>
              <CheckIcon />
            </div>
          </Card>
        </div>
        
        <Card className="p-4 rounded-2xl bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-[#1A73E8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-900">Download More Data</h4>
              <p className="text-sm text-blue-700 mt-1">
                Download additional regions and safety information for offline access
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="p-4 bg-white border-t space-y-2">
        <Button className="w-full bg-[#1A73E8] hover:bg-[#1557b0] rounded-full h-12">
          Retry Connection
        </Button>
        <Button variant="outline" className="w-full rounded-full h-12 border-2">
          View Offline Data
        </Button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
