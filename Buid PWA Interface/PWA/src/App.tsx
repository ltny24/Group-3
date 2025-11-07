import { OnboardingScreen } from "./components/OnboardingScreen";
import { HomeScreen } from "./components/HomeScreen";
import { MapScreen } from "./components/MapScreen";
import { AlertHubScreen } from "./components/AlertHubScreen";
import { AlertDetailScreen } from "./components/AlertDetailScreen";
import { SOSScreen } from "./components/SOSScreen";
import { HistoryScreen } from "./components/HistoryScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { HelpScreen } from "./components/HelpScreen";
import { NotificationsScreen } from "./components/NotificationsScreen";
import { OfflineScreen } from "./components/OfflineScreen";

export default function App() {
  const screens = [
    { id: 1, name: "1. Onboarding", component: <OnboardingScreen /> },
    { id: 2, name: "2. Home", component: <HomeScreen /> },
    { id: 3, name: "3. Map", component: <MapScreen /> },
    { id: 4, name: "4. Alert Hub", component: <AlertHubScreen /> },
    { id: 5, name: "5. Alert Detail", component: <AlertDetailScreen /> },
    { id: 6, name: "6. SOS", component: <SOSScreen /> },
    { id: 7, name: "7. History", component: <HistoryScreen /> },
    { id: 8, name: "8. Settings", component: <SettingsScreen /> },
    { id: 9, name: "9. Profile", component: <ProfileScreen /> },
    { id: 10, name: "10. Help", component: <HelpScreen /> },
    { id: 11, name: "11. Notifications", component: <NotificationsScreen /> },
    { id: 12, name: "12. Offline", component: <OfflineScreen /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mb-8 text-center">
        <h1 className="text-white mb-2">Travel Safety System - Mobile Wireframes</h1>
        <p className="text-gray-400">12 Screen Mobile App Prototype</p>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-8">
        {screens.map((screen) => (
          <div key={screen.id} className="flex-shrink-0">
            <div className="mb-3 text-center">
              <span className="text-white text-sm">{screen.name}</span>
            </div>
            <div className="w-[375px] h-[812px] bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
              {screen.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
