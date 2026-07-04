import { BriefcaseMedical, Siren, Users, Settings, ChevronRight, UserCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Screen } from "../types";
import { motion } from "motion/react";
import { useLanguage } from "../lib/LanguageContext";

interface HomeScreenProps {
  setScreen: (screen: Screen) => void;
}

export function HomeScreen({ setScreen }: HomeScreenProps) {
  const { t } = useLanguage();

  const menuItems = [
    { id: 'first-aid', icon: BriefcaseMedical, title: t('firstAid'), desc: 'Emergency procedures', color: 'bg-blue-50 text-blue-600' },
    { id: 'profile', icon: UserCircle, title: t('medicalProfile'), desc: t('healthRecords'), color: 'bg-purple-50 text-purple-600' },
    { id: 'sos', icon: Siren, title: t('sos'), desc: 'Call help immediately', color: 'bg-red-50 text-red-600' },
    { id: 'contacts', icon: Users, title: t('contacts'), desc: 'Family & Friends', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'settings', icon: Settings, title: t('settings'), desc: 'App configuration', color: 'bg-zinc-50 text-zinc-600' },
  ];

  return (
    <div className="flex flex-col gap-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-1">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">
          {t('quickResponse').split(' ')[0]} <span className="text-red-600">{t('quickResponse').split(' ')[1]}</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t('whatSituation')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-zinc-200 dark:border-zinc-800 overflow-hidden"
              onClick={() => setScreen(item.id as Screen)}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-5 gap-4">
                  <div className={`p-4 rounded-2xl ${item.color} transition-transform group-hover:scale-110`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-6 bg-red-600 rounded-3xl text-white shadow-xl shadow-red-200 dark:shadow-none">
        <h2 className="text-xl font-bold mb-2">{t('emergencyHelp')}?</h2>
        <p className="text-red-100 text-sm mb-4">{t('emergencyHelpSub')}</p>
        <button 
          onClick={() => setScreen('sos')}
          className="bg-white text-red-600 font-black py-3 px-6 rounded-xl w-full active:scale-95 transition-transform uppercase"
        >
          {t('sosPanel')}
        </button>
      </div>
    </div>
  );
}
