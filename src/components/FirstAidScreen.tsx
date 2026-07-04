// Paste this line at the absolute top of the file:
import { supabase } from '../supabaseClient';

// Paste this handling function block inside your FirstAidScreen component function:
const fetchAndSpeakFirstAid = async (categoryId: number) => {
  const { data } = await supabase
    .from('first_aid_data')
    .select('instructions')
    .eq('id', categoryId)
    .single();

  if (data?.instructions) {
    const utterance = new SpeechSynthesisUtterance(data.instructions);
    window.speechSynthesis.speak(utterance);
  }
};

import { useState, useEffect } from "react";
import { FIRST_AID_PROCEDURES } from "../constants";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Volume2, AlertTriangle, Lightbulb, ChevronRight, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { FirstAidProcedure } from "../types";
import { useLanguage } from "../lib/LanguageContext";

export function FirstAidScreen() {
  const { t, getLocale, language } = useLanguage();
  const [selectedProcedure, setSelectedProcedure] = useState<FirstAidProcedure | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [nativeVoiceAvailable, setNativeVoiceAvailable] = useState(true);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const locale = getLocale();
    const langCode = locale.split('-')[0].toLowerCase();
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const hasVoice = currentVoices.some(v => v.lang.toLowerCase().replace('_', '-').includes(langCode));
    setNativeVoiceAvailable(hasVoice);
  }, [getLocale, voices, language]);

  const speak = (text: string) => {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    const locale = getLocale();
    const langCode = locale.split('-')[0].toLowerCase();
    
    // Set language and natural rate
    utterance.lang = locale;
    utterance.rate = 0.9; // Slightly slower for emergency clarity
    utterance.pitch = 1;
    
    // Find matching voice
    const currentVoices = window.speechSynthesis.getVoices();
    const normalizedLocale = locale.toLowerCase().replace('_', '-');
    
    let voice = currentVoices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === normalizedLocale;
    }) || currentVoices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang.startsWith(langCode);
    }) || currentVoices.find(v => {
      const vName = v.name.toLowerCase();
      // Search for language name in the voice name (e.g. "Kannada", "Hindi")
      const langNames: Record<string, string> = {
        'kn': 'kannada',
        'hi': 'hindi',
        'es': 'spanish',
        'en': 'english'
      };
      return vName.includes(langNames[langCode] || langCode);
    });
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      console.warn(`No specific voice found for ${locale}. Browser will use default.`);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
    };

    // Use a small delay as some browsers ignore speak() immediately after cancel()
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleReadAloud = (procedure: FirstAidProcedure) => {
    const translatedTitle = t(`title.${procedure.id}`);
    const translatedSteps = procedure.steps.map((_, i) => t(`${procedure.id}.step${i + 1}`)).join(". ");
    const translatedTips = procedure.tips.map((_, i) => t(`${procedure.id}.tip${i + 1}`)).join(". ");
    const translatedWarnings = procedure.warnings.map((_, i) => t(`${procedure.id}.warning${i + 1}`)).join(". ");
    
    const fullText = `${translatedTitle}. ${t('steps')}: ${translatedSteps}. ${t('emergencyTips')}: ${translatedTips}. ${t('criticalWarnings')}: ${translatedWarnings}`;
    speak(fullText);
  };

  return (
    <div className="h-full flex flex-col pt-4">
      <AnimatePresence mode="wait">
        {!selectedProcedure ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <div className="px-1 mb-2">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase">{t('firstAidGuide')}</h1>
              <p className="text-zinc-500 text-sm">{t('selectCategory')}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 pb-24">
              {FIRST_AID_PROCEDURES.map((proc) => (
                <Card 
                  key={proc.id}
                  className="cursor-pointer active:scale-95 transition-transform border-zinc-200 dark:border-zinc-800"
                  onClick={() => setSelectedProcedure(proc)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-lg">{t(`title.${proc.id}`)}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6 pb-24"
          >
            <div className="flex items-center gap-4 px-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setSelectedProcedure(null);
                  stopSpeaking();
                }}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-black">{t(`title.${selectedProcedure.id}`).toUpperCase()}</h1>
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-none uppercase"
                onClick={() => handleReadAloud(selectedProcedure)}
              >
                <Volume2 className="mr-2 w-6 h-6" />
                {isSpeaking ? t('restart') : t('readAloud')}
              </Button>
              {!nativeVoiceAvailable && (
                <p className="text-[10px] text-amber-600 font-bold text-center uppercase tracking-tighter">
                  {t('noVoice')}
                </p>
              )}
              {isSpeaking && (
                <Button 
                  variant="outline"
                  className="py-6 px-6 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-2xl font-bold uppercase"
                  onClick={stopSpeaking}
                >
                  {t('stop')}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 uppercase tracking-widest text-[10px] font-black">{t('steps')}</Badge>
              </div>
              {selectedProcedure.steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-l-4 border-l-red-600 shadow-sm">
                    <CardContent className="p-4 flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{t(`${selectedProcedure.id}.step${index + 1}`)}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 mt-2 text-red-600 hover:text-red-700 font-bold text-xs"
                          onClick={() => speak(t(`${selectedProcedure.id}.step${index + 1}`))}
                        >
                          <Volume2 className="w-3 h-3 mr-1" /> {t('voiceAssistance').split(' ')[0]}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
               <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <AlertTitle className="font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">{t('emergencyTips')}</AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-500 font-medium">
                  <ul className="list-disc pl-4 space-y-1 mt-2">
                    {selectedProcedure.tips.map((_, i) => (
                      <li key={i}>{t(`${selectedProcedure.id}.tip${i + 1}`)}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-bold uppercase tracking-wider">{t('criticalWarnings')}</AlertTitle>
                <AlertDescription className="font-medium">
                  <ul className="list-disc pl-4 space-y-1 mt-2">
                    {selectedProcedure.warnings.map((_, i) => (
                      <li key={i}>{t(`${selectedProcedure.id}.warning${i + 1}`)}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
