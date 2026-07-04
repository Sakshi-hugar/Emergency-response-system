import { ShieldAlert } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";

export function Header() {
  const { t } = useLanguage();
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 z-50">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
          {t('emergencyResponse').split(' ')[0]} <span className="text-red-600 font-black">{t('emergencyResponse').split(' ')[1]}</span>
        </span>
      </div>
    </header>
  );
}
