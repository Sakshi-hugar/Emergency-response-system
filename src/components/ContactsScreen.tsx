import { useState, useEffect } from "react";
import { Plus, User, Phone, Trash2, Edit2, MessageSquare, PhoneCall } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EmergencyContact } from "../types";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useLanguage } from "../lib/LanguageContext";

export function ContactsScreen() {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: "",
    phone: "",
    relation: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("emergency_contacts");
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveContacts = (updated: EmergencyContact[]) => {
    setContacts(updated);
    localStorage.setItem("emergency_contacts", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error(t('namePhoneRequired'));
      return;
    }
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      relation: newContact.relation || "Global"
    };
    saveContacts([...contacts, contact]);
    setNewContact({ name: "", phone: "", relation: "" });
    setIsAddOpen(false);
    toast.success(t('contactAdded'));
  };

  const handleDelete = (id: string) => {
    saveContacts(contacts.filter(c => c.id !== id));
    toast.info(t('contactRemoved'));
  };

  return (
    <div className="flex flex-col gap-6 pt-6 pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase">{t('contacts')}</h1>
          <p className="text-zinc-500 text-sm">{t('contactsSub')}</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 rounded-xl h-12 w-12 p-0 shadow-lg shadow-red-200">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t('addContact')}</DialogTitle>
              <DialogDescription>{t('addContactSub')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. John Doe" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input 
                  id="phone" 
                  placeholder="e.g. +1 234 567 890" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relation">{t('relation')}</Label>
                <Input 
                  id="relation" 
                  placeholder="e.g. Spouse, Parent, Friend" 
                  value={newContact.relation}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} className="bg-red-600 w-full font-bold">{t('saveContact')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <User className="w-12 h-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500 font-medium">{t('noContacts')}</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="border-zinc-200 dark:border-zinc-800 overflow-hidden group">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 border-2 border-zinc-100 uppercase font-black text-red-600">
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-white leading-tight">{contact.name}</h3>
                    <p className="text-xs text-red-600 font-bold uppercase tracking-widest">{contact.relation}</p>
                    <p className="text-sm text-zinc-500 font-medium">{contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
                      onClick={() => {
                        toast.info(`${t('calling')} ${contact.name}...`);
                        window.location.href = `tel:${contact.phone}`;
                      }}
                    >
                      <PhoneCall className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl"
                      onClick={() => {
                        toast.info(`${t('messaging')} ${contact.name}...`);
                        window.location.href = `sms:${contact.phone}`;
                      }}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
