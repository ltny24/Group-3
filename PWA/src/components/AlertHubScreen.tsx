import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { MapPin, Clock } from "lucide-react";

export function AlertHubScreen() {
  const alerts = [
    { id: 1, title: "Severe Storm Warning", location: "Ho Chi Minh City", time: "5 min ago", severity: "Critical", color: "bg-red-500" },
    { id: 2, title: "Heavy Traffic", location: "District 1", time: "15 min ago", severity: "High", color: "bg-orange-500" },
    { id: 3, title: "Air Quality Alert", location: "District 7", time: "1 hour ago", severity: "Moderate", color: "bg-yellow-500" },
    { id: 4, title: "Road Construction", location: "District 3", time: "2 hours ago", severity: "Low", color: "bg-green-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b space-y-4">
        <h2>Alert Hub</h2>
        <Tabs defaultValue="nearme" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nearme">Near Me</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="p-4 rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h3 className="flex-1">{alert.title}</h3>
              <Badge className={`${alert.color} text-white border-0`}>
                {alert.severity}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{alert.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{alert.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
