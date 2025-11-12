import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

export function NotificationsScreen() {
  const notifications = [
    { id: 1, icon: "alert", title: "Severe storm nearby!", message: "Heavy rainfall expected in 30 minutes", time: "Just now", unread: true, color: "red" },
    { id: 2, icon: "bell", title: "New safety alert", message: "Traffic congestion in District 1", time: "15 min ago", unread: true, color: "orange" },
    { id: 3, icon: "info", title: "Weather update", message: "Clear skies expected tomorrow", time: "1 hour ago", unread: false, color: "blue" },
    { id: 4, icon: "check", title: "Alert resolved", message: "Road construction completed", time: "2 hours ago", unread: false, color: "green" },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between">
          <h2>Notifications</h2>
          <button className="text-sm text-[#1A73E8]">Mark all read</button>
        </div>
      </div>
      
      {/* Toast popup example */}
      <div className="p-4">
        <Card className="p-4 rounded-2xl bg-orange-50 border-orange-200 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-orange-900">⚠️ Severe storm nearby!</h4>
              <p className="text-sm text-orange-700 mt-1">Take shelter immediately</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-2">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 rounded-2xl ${notification.unread ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.color === 'red' ? 'bg-red-100' :
                notification.color === 'orange' ? 'bg-orange-100' :
                notification.color === 'blue' ? 'bg-blue-100' :
                'bg-green-100'
              }`}>
                {notification.icon === 'alert' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                {notification.icon === 'bell' && <Bell className="w-5 h-5 text-orange-600" />}
                {notification.icon === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                {notification.icon === 'check' && <CheckCircle className="w-5 h-5 text-green-600" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4>{notification.title}</h4>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-[#1A73E8] rounded-full flex-shrink-0 mt-1.5"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
