import { Home, BriefcaseMedical, Siren, Users, Settings, User } from "lucide-react";
import { Screen } from "../types";
import { cn } from "@/lib/utils";
import { useLanguage } from "../lib/LanguageContext";

interface NavigationProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

export function Navigation({ currentScreen, setScreen }: NavigationProps) {
  const { t } = useLanguage();
  const items = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'first-aid', icon: BriefcaseMedical, label: t('firstAid') },
    { id: 'sos', icon: Siren, label: t('sos') },
    { id: 'profile', icon: User, label: t('profile') },
    { id: 'contacts', icon: Users, label: t('contacts') },
    { id: 'settings', icon: Settings, label: t('settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setScreen(item.id as Screen)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200",
            currentScreen === item.id 
              ? "text-red-600" 
              : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          )}
        >
          <item.icon className={cn("w-6 h-6", currentScreen === item.id && "animate-pulse")} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          {currentScreen === item.id && (
            <div className="absolute top-0 w-8 h-1 bg-red-600 rounded-b-full" />
          )}
        </button>
      ))}
    </nav>
  );
}
