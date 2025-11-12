import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export function SOSScreen() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <h2 className="text-red-500">Emergency SOS</h2>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="text-center space-y-2">
          <h3>Need Emergency Help?</h3>
          <p className="text-gray-600">Press and hold the button below to send an emergency alert to your contacts and local authorities</p>
        </div>
        
        <div className="relative">
          <button
            className="w-48 h-48 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
            onClick={() => {
              setStatus("sending");
              setTimeout(() => setStatus("sent"), 2000);
            }}
          >
            <AlertCircle className="w-24 h-24 text-white" strokeWidth={2} />
          </button>
          
          {/* Pulsing rings */}
          {status === "idle" && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-10 animate-pulse"></div>
            </>
          )}
        </div>
        
        <div className="text-center">
          {status === "idle" && (
            <p className="text-gray-600">Hold to activate</p>
          )}
          {status === "sending" && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-500">Sending emergency alert...</p>
              </div>
            </div>
          )}
          {status === "sent" && (
            <Card className="p-4 rounded-2xl bg-green-50 border-green-200">
              <p className="text-green-700">✓ Alert sent successfully!</p>
              <p className="text-sm text-green-600 mt-1">Help is on the way</p>
            </Card>
          )}
        </div>
        
        <div className="w-full space-y-3">
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#1A73E8]" />
              </div>
              <div>
                <h4>Emergency Contacts</h4>
                <p className="text-sm text-gray-600">Will be notified immediately</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4>Location Sharing</h4>
                <p className="text-sm text-gray-600">Your location will be shared</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {status === "sent" && (
        <div className="p-4 bg-white border-t">
          <Button 
            variant="outline" 
            className="w-full rounded-full h-12 border-2"
            onClick={() => setStatus("idle")}
          >
            Cancel Alert
          </Button>
        </div>
      )}
    </div>
  );
}
