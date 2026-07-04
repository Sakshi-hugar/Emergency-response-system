// Paste this line at the absolute top of the file:
import { supabase } from '../supabaseClient';

// Paste this configuration function inside your SettingsScreen component block:
const updateSystemSettings = async (isDark: boolean, lang: string, contactId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('profiles').upsert({
      id: user.id,
      dark_mode_enabled: isDark,
      language_selection: lang,
      default_contact_id: contactId
    });
  }
};

import { Settings, Moon, Globe, Volume2, Bell, ChevronRight, Info, ShieldCheck, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Separator } from "./ui/separator";
import { useLanguage, Language } from "../lib/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

export function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [voiceAssist, setVoiceAssist] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'es', name: 'Spanish (Español)' },
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col gap-6 pt-6 pb-24 animate-in slide-in-from-right-4 duration-500">
      <div className="px-1">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{t('settings')}</h1>
        <p className="text-zinc-500 text-sm">Personalize your safety app</p>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <Label htmlFor="dark-mode" className="font-bold text-base cursor-pointer">{t('darkMode')}</Label>
            </div>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Volume2 className="w-5 h-5 text-red-600" />
              </div>
              <Label htmlFor="voice" className="font-bold text-base cursor-pointer">{t('voiceAssistance')}</Label>
            </div>
            <Switch id="voice" checked={voiceAssist} onCheckedChange={setVoiceAssist} />
          </div>
          <Separator />
          <div className="flex items-center justify-between p-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <Label htmlFor="notifs" className="font-bold text-base cursor-pointer">{t('notifications')}</Label>
            </div>
            <Switch id="notifs" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      <div className="px-1 mt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">International</h3>
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardContent className="p-0">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-bold">{t('language')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm font-medium">
                      {languages.find(l => l.code === language)?.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md border-none p-0 overflow-hidden rounded-3xl">
                <DialogHeader className="p-6 bg-emerald-600 text-white">
                  <DialogTitle className="text-xl font-bold tracking-tight">Select Language</DialogTitle>
                </DialogHeader>
                <div className="p-2 bg-white dark:bg-zinc-900">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                    >
                      <span className={`font-bold ${language === lang.code ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {lang.name}
                      </span>
                      {language === lang.code && <Check className="w-5 h-5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="px-1 mt-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">About</h3>
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
          <CardContent className="p-0">
             <div className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-bold">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600">
                  <Info className="w-5 h-5" />
                </div>
                <span className="font-bold">App Version</span>
              </div>
              <Badge variant="outline">v2.4.0-pro</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto pt-10 text-center">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Built for Safety • AI Powered</p>
      </div>
    </div>
  );
}
