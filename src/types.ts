export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface FirstAidStep {
  text: string;
}

export interface FirstAidProcedure {
  id: string;
  title: string;
  steps: FirstAidStep[];
  tips: string[];
  warnings: string[];
}

export interface Profile {
  name: string;
  bloodGroup: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  dateOfBirth: string;
}

export type Screen = 'home' | 'first-aid' | 'sos' | 'contacts' | 'settings' | 'profile';
