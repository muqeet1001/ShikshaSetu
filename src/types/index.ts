export type Screen = 'Splash' | 'NameLocale' | 'QuickStart' | 'Interests' | 'Flowchart' | 'Eligibility' | 'Colleges' | 'MentorsList' | 'MentorProfile' | 'CollegeDetails' | 'MessageThread';

export interface UserData {
  fullName?: string;
  language?: 'EN' | 'HI' | 'UR';
  formData?: any;
  interests?: string[];
}

export type RootStackParamList = {
  Splash: undefined;
  NameLocale: undefined;
  ClassSelection: { fullName: string; language: 'EN' | 'HI' | 'UR' };
  CareerChatBot: { fullName: string; classLevel: '10th' | '12th' };
  QuickStart: { fullName?: string; classLevel?: '10th' | '12th' };
  Interests: { fullName?: string; classLevel?: "10th" | "12th"; selectedCareer?: string; formData?: any; assessmentResult?: any };
  Flowchart: { interests: string[]; formData?: any };
  Eligibility: { formData: any; interests?: string[] };
  Colleges: { course?: string; formData?: any; interests?: string[] };
  MentorsList: { district?: string; college?: string; course?: string; totalAdmits?: number };
  MentorProfile: { mentorId: string };
  StudentsList: { district?: string; college?: string; course?: string; totalAdmits?: number };
  StudentProfile: { studentId: string };
  CollegeDetails: { college?: any; course?: string; formData?: any };
  MessageThread: { mentor?: any; student?: any };
};
