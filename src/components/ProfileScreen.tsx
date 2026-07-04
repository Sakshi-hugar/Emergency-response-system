import { useState, useEffect } from "react";
import { User, Save, HeartPulse, Droplets, AlertCircle, Pill, ClipboardList, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Profile } from "../types";
import { toast } from "sonner";
import { useLanguage } from "../lib/LanguageContext";

export function ProfileScreen() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    dateOfBirth: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    toast.success(t('profileSaved'), {
      description: t('emergencyStored')
    });
  };

  return (
    <div className="flex flex-col gap-6 pt-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-1">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{t('medicalProfile')}</h1>
        <p className="text-zinc-500 text-sm font-medium italic">{t('profileSub')}</p>
      </div>

      <div className="space-y-4">
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 py-4 px-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <User className="w-4 h-4" /> {t('personalDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase text-zinc-400">{t('fullName')}</Label>
              <div className="relative">
                <Input 
                  id="name" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="pl-10"
                />
                <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dob" className="text-xs font-bold uppercase text-zinc-400">{t('dob')}</Label>
                <div className="relative">
                  <Input 
                    id="dob" 
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                    className="pl-10"
                  />
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="blood" className="text-xs font-bold uppercase text-zinc-400">{t('bloodGroup')}</Label>
                <div className="relative">
                  <Input 
                    id="blood" 
                    value={profile.bloodGroup}
                    onChange={(e) => setProfile({...profile, bloodGroup: e.target.value})}
                    placeholder="e.g. O+"
                    className="pl-10"
                  />
                  <Droplets className="w-4 h-4 absolute left-3 top-3 text-red-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden border-t-4 border-t-red-600">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 py-4 px-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> {t('medicalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="allergies" className="text-xs font-bold uppercase text-zinc-400">{t('allergies')}</Label>
              <div className="relative">
                <Input 
                  id="allergies" 
                  value={profile.allergies}
                  onChange={(e) => setProfile({...profile, allergies: e.target.value})}
                  placeholder="e.g. Peanuts, Penicillin"
                  className="pl-10"
                />
                <AlertCircle className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="meds" className="text-xs font-bold uppercase text-zinc-400">{t('medications')}</Label>
              <div className="relative">
                <Input 
                  id="meds" 
                  value={profile.medications}
                  onChange={(e) => setProfile({...profile, medications: e.target.value})}
                  placeholder="e.g. Aspirin 100mg"
                  className="pl-10"
                />
                <Pill className="w-4 h-4 absolute left-3 top-3 text-blue-500" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="conditions" className="text-xs font-bold uppercase text-zinc-400">{t('conditions')}</Label>
              <div className="relative">
                <Input 
                  id="conditions" 
                  value={profile.medicalConditions}
                  onChange={(e) => setProfile({...profile, medicalConditions: e.target.value})}
                  placeholder="e.g. Asthma, Diabetes"
                  className="pl-10"
                />
                <ClipboardList className="w-4 h-4 absolute left-3 top-3 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          className="w-full bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-black py-8 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-[0.98] transition-all"
          onClick={handleSave}
        >
          <Save className="mr-2 w-6 h-6" /> {t('saveProfile')}
        </Button>
      </div>

      <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-4">
        {t('securityMessage')}
      </p>
    </div>
  );
}
