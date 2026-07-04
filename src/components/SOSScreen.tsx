import { supabase } from '../supabaseClient';
import { Siren, Phone, MessageSquare, UserPlus, PhoneCall, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useLanguage } from "../lib/LanguageContext";
import { useState, useEffect, useRef } from "react";
import { EmergencyContact, Screen } from "../types";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface SOSScreenProps {
  setScreen: (screen: Screen) => void;
}

export function SOSScreen({ setScreen }: SOSScreenProps) {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("emergency_contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const handleEmergencyCall = (number: string, label: string) => {
    toast.success(`${label} (${number})...`);
    window.location.href = `tel:${number}`;
  };

  const services = [
    { label: t('callAmbulance'), number: "108", icon: Phone, color: "bg-red-600" },
    { label: t('callPolice'), number: "100", icon: Phone, color: "bg-blue-600" },
    { label: t('callFire'), number: "101", icon: Phone, color: "bg-orange-600" },
  ];

  // 1. Core Logic Engine: Gathers Physical Device GPS Coordinates
  const executeEmergencyActions = () => {
    setCountdown(null);

    if (!("geolocation" in navigator)) {
      toast.error(t('locationUnsupported') || "Geolocation unsupported. Dialing directly.");
      triggerCallAndSms(null, null);
      return;
    }

    setIsLocating(true);
    toast.info("📍 Fetching precise GPS location data...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        triggerCallAndSms(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLocating(false);
        console.error("GPS Error, bypassing to direct configuration:", error);
        toast.error("Location lookup failed. Sending message without map context.");
        triggerCallAndSms(null, null);
      },
      // Change maximumAge and increase timeout values to ensure stability on slower networks
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 2. Communication Pipeline: Fetches Saved Contacts & Triggers Call/SMS Frames
  const triggerCallAndSms = async (latitude: number | null, longitude: number | null) => {
    let targetPhone = "";
    let targetName = "Emergency Contact";

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('default_contact_id')
          .eq('id', user.id)
          .single();
        
        if (profile?.default_contact_id) {
          const { data: contact } = await supabase
            .from('emergency_contacts')
            .select('contact_name, contact_phone')
            .eq('id', profile.default_contact_id)
            .single();

          if (contact) {
            targetPhone = contact.contact_phone;
            targetName = contact.contact_name;
          }
        }
      }
    } catch (err) {
      console.log("Supabase fetch skipped or unauthenticated, falling back to local storage profile data structure.");
    }

    // FALLBACK ENGINE: If not logged into backend services, extract raw interface array variables
    if (!targetPhone && contacts.length > 0) {
      const primary = contacts[0];
      targetPhone = primary.phone;
      targetName = primary.name;
    }

    // Execute System Applications Dispatch Framework
    if (targetPhone) {
      const cleanPhone = targetPhone.replace(/\s+/g, '');
      let messageText = "I need help! Emergency!";
      
      if (latitude && longitude) {
        messageText += ` My live location: google.com${latitude},${longitude}`;
      }

      toast.success(`Alerting ${targetName}...`);
      
      // Step 1: Fire up system messaging application pane with context text payload
      window.location.href = `sms:${cleanPhone}?body=${encodeURIComponent(messageText)}`;
      
      // Step 2: Open system dial pad interface window frames shortly after text hooks launch
      setTimeout(() => {
        window.location.href = `tel:${cleanPhone}`;
      }, 2000);
    } else {
      toast.error("No emergency contacts found online or offline. Please configure configuration settings profile first.");
    }
  };

  // 3. System Intercept Timing Hooks
  const startSosCountdown = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    
    let currentCount = 5;
    setCountdown(currentCount);
    toast.error("Emergency Countdown Activated. System firing in 5 seconds.");

    timerRef.current = window.setInterval(() => {
      currentCount -= 1;
      if (currentCount <= 0) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        executeEmergencyActions();
      } else {
        setCountdown(currentCount);
      }
    }, 1000);
  };

  const stopSosAlert = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountdown(null);
    toast.success("SOS Alert Aborted Successfully. False alarm avoided.");
  };

  return (
    <div className="flex flex-col gap-8 pt-8 pb-24 items-center animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">{t('sosPanel')}</h1>
        <p className="text-zinc-500 font-medium">{t('assistanceNeeded')}</p>
      </div>

      <AnimatePresence mode="wait">
        {countdown === null && !isLocating ? (
          <motion.button
            key="sos-idle"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={startSosCountdown}
            className="w-64 h-64 rounded-full bg-red-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-red-500/50 border-8 border-white dark:border-zinc-800 relative group"
          >
            <div className="absolute inset-0 rounded-full animate-ping bg-red-600 opacity-20 group-hover:opacity-40" />
            <Siren className="w-16 h-16 mb-2" />
            <span className="text-4xl font-black tracking-tighter uppercase">{t('sos')}</span>
            <span className="text-xs font-bold mt-1 opacity-80 uppercase tracking-widest">{t('holdToAlertSub')}</span>
          </motion.button>
        ) : countdown !== null ? (
          <motion.div
            key="sos-countdown"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-64 h-64 rounded-full bg-zinc-900 dark:bg-zinc-100 flex flex-col items-center justify-center text-white dark:text-zinc-900 shadow-2xl border-8 border-red-600 relative p-4 text-center"
          >
            <h1 className="text-6xl font-black text-red-600 animate-pulse">{countdown}</h1>
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">Sending automatically...</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={stopSosAlert}
              className="mt-4 font-black text-xs uppercase tracking-wider rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 px-4 h-9"
            >
              <XCircle className="w-4 h-4" />
              CANCEL
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="sos-locating"
            className="w-64 h-64 rounded-full bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center text-zinc-600 dark:text-zinc-300 border-8 border-dashed border-zinc-300 dark:border-zinc-700"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Syncing Location...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Response Utility Layout Grid */}
      <div className="grid grid-cols-1 w-full gap-3 mt-4">
        <div className="flex items-center justify-between px-1 mb-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('emergencyResponse')}</h2>
        </div>
        {services.map((service) => (
          <Button
            key={service.label}
            variant="outline"
            className="h-20 flex items-center justify-between px-6 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl active:bg-zinc-50"
            onClick={() => handleEmergencyCall(service.number, service.label)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${service.color} text-white`}>
                <service.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{service.label}</p>
                <p className="text-xl font-black">{service.number}</p>
              </div>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-zinc-400" />
            </div>
          </Button>
        ))}
      </div>

      {/* Contacts List Grid Area */}
      <div className="w-full space-y-4 mt-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">{t('contacts')}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-bold text-red-600 hover:text-red-700 p-0 h-auto"
            onClick={() => setScreen('contacts')}
          >
            {t('settings').toUpperCase()}
          </Button>
        </div>

        {contacts.length === 0 ? (
          <Button 
            variant="outline" 
            className="w-full h-16 border-dashed border-2 rounded-2xl flex items-center justify-center gap-2 text-zinc-400"
            onClick={() => setScreen('contacts')}
          >
            <UserPlus className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">{t('addContact')}</span>
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <CardContent className="p-3 flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-zinc-100 uppercase font-black text-red-600">
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{contact.name}</p>
                    <p className="text-[10px] text-red-600 font-black uppercase tracking-tighter">{contact.relation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                      onClick={() => {
                        toast.info(`${t('calling')} ${contact.name}...`);
                        window.location.href = `tel:${contact.phone}`;
                      }}
                    >
                      <PhoneCall className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
                      onClick={() => {
                        toast.info(`${t('messaging')} ${contact.name}...`);
                        window.location.href = `sms:${contact.phone}`;
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
