import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronRight, Phone, MapPin, Edit, LogOut } from "lucide-react";

export function ProfileScreen() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2>Profile</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-[#1A73E8] text-white text-2xl">AN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2>Alex Nguyen</h2>
              <p className="text-gray-600">alex.nguyen@email.com</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h3 className="mb-3 text-gray-600">Emergency Contacts</h3>
            <Card className="rounded-2xl divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4>Mom</h4>
                    <p className="text-sm text-gray-600">+84 901 234 567</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4>Brother</h4>
                    <p className="text-sm text-gray-600">+84 902 345 678</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <button className="p-4 w-full text-left text-[#1A73E8] hover:bg-gray-50">
                + Add Emergency Contact
              </button>
            </Card>
          </div>
          
          <div>
            <h3 className="mb-3 text-gray-600">Saved Locations</h3>
            <Card className="rounded-2xl divide-y">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <div>
                    <h4>Home</h4>
                    <p className="text-sm text-gray-600">District 7, HCMC</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#1A73E8]" />
                  </div>
                  <div>
                    <h4>Work</h4>
                    <p className="text-sm text-gray-600">District 1, HCMC</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              
              <button className="p-4 w-full text-left text-[#1A73E8] hover:bg-gray-50">
                + Add Location
              </button>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <Button variant="outline" className="w-full rounded-full h-12 border-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
