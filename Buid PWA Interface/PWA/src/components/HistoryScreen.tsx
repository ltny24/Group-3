import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Clock, AlertCircle, Bell } from "lucide-react";

export function HistoryScreen() {
  const historyItems = [
    {
      date: "Today",
      items: [
        { id: 1, type: "alert", title: "Severe Storm Warning", time: "14:30", severity: "Critical", color: "bg-red-500" },
        { id: 2, type: "alert", title: "Heavy Traffic", time: "09:15", severity: "High", color: "bg-orange-500" },
      ]
    },
    {
      date: "Yesterday",
      items: [
        { id: 3, type: "sos", title: "SOS Alert Sent", time: "18:45", severity: "SOS", color: "bg-red-600" },
        { id: 4, type: "alert", title: "Air Quality Alert", time: "12:20", severity: "Moderate", color: "bg-yellow-500" },
      ]
    },
    {
      date: "Nov 4, 2025",
      items: [
        { id: 5, type: "alert", title: "Road Construction", time: "16:00", severity: "Low", color: "bg-green-500" },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <h2>History</h2>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {historyItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-sm text-gray-500">{section.date}</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            
            <div className="space-y-3">
              {section.items.map((item) => (
                <Card key={item.id} className="p-4 rounded-2xl relative pl-12">
                  <div className="absolute left-4 top-4">
                    {item.type === "sos" ? (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bell className="w-4 h-4 text-[#1A73E8]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4>{item.title}</h4>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm">{item.time}</span>
                      </div>
                    </div>
                    <Badge className={`${item.color} text-white border-0 text-xs`}>
                      {item.severity}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
