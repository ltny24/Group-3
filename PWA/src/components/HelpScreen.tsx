import { Card } from "./ui/card";
import { ChevronRight, Info, Phone, Lightbulb, Shield } from "lucide-react";

export function HelpScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2>Help & Support</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <h3 className="mb-3 text-gray-600">About</h3>
          <Card className="p-4 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-[#1A73E8]" />
              </div>
              <div>
                <h4>Travel Safety System</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Our app provides real-time safety alerts, emergency SOS support, and offline access to critical information to keep you safe wherever you travel.
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <h3 className="mb-3 text-gray-600">Emergency Numbers</h3>
          <Card className="rounded-2xl divide-y">
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4>Police</h4>
                  <p className="text-sm text-gray-600">113</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4>Ambulance</h4>
                  <p className="text-sm text-gray-600">115</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4>Fire Department</h4>
                  <p className="text-sm text-gray-600">114</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>
        
        <div>
          <h3 className="mb-3 text-gray-600">Safety Tips</h3>
          <Card className="rounded-2xl divide-y">
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <h4>Natural Disaster Preparedness</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <h4>Travel Safety Guidelines</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <h4>First Aid Basics</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>
        
        <div>
          <h3 className="mb-3 text-gray-600">Legal</h3>
          <Card className="rounded-2xl divide-y">
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <h4>Privacy Policy</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
