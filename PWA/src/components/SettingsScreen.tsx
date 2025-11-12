import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { ChevronRight, Globe, Bell, Moon, WifiOff, Shield } from "lucide-react";

export function SettingsScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2>Settings</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <h3 className="mb-3 text-gray-600">Preferences</h3>
          <Card className="rounded-2xl divide-y">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div>
                  <h4>Language</h4>
                  <p className="text-sm text-gray-600">English</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <h4>Notifications</h4>
                  <p className="text-sm text-gray-600">Push alerts enabled</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <h4>Dark Mode</h4>
                  <p className="text-sm text-gray-600">System default</p>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-gray-600" />
                <div>
                  <h4>Offline Mode</h4>
                  <p className="text-sm text-gray-600">Cache data locally</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
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
            
            <button className="p-4 flex items-center justify-between w-full text-left hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <h4>Terms of Service</h4>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
        </div>
        
        <Card className="rounded-2xl p-4 bg-gray-100 border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Version 1.2.3</p>
            <p className="mt-1">© 2025 Travel Safety System</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
