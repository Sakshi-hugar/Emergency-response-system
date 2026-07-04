import { useState } from "react";
import { Screen } from "./types";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { HomeScreen } from "./components/HomeScreen";
import { FirstAidScreen } from "./components/FirstAidScreen";
import { SOSScreen } from "./components/SOSScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ContactsScreen } from "./components/ContactsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { Toaster } from "./components/ui/sonner";
import { ScrollArea } from "./components/ui/scroll-area";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from "sonner";
import { useEffect } from "react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success("Offline Mode Active", {
        description: "First aid guide & SOS features are available without internet.",
        duration: 5000,
      });
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast.info("Update Available", {
        description: "A new version of the app is available.",
        action: {
          label: "Update",
          onClick: () => updateServiceWorker(true),
        },
      });
    }
  }, [needRefresh, updateServiceWorker]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen setScreen={setCurrentScreen} />;
      case 'first-aid':
        return <FirstAidScreen />;
      case 'sos':
        return <SOSScreen setScreen={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen />;
      case 'contacts':
        return <ContactsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen setScreen={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-red-200">
      <Header />
      
      <main className="pt-20 pb-28 px-4 max-w-lg mx-auto min-h-screen">
        {renderScreen()}
      </main>

      <Navigation currentScreen={currentScreen} setScreen={setCurrentScreen} />
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}
