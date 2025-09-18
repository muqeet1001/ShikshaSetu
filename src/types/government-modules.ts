// District Admits Module Types
export interface DistrictAdmitData {
  district: string;
  college: string;
  course: string;
  academicYear: string;
  admitCount: number;
  source: string;
  sourceFile?: string;
  lastUpdated: string;
  round?: string;
}

export interface AdmissionSource {
  name: string;
  type: 'BOPEE' | 'NIRF' | 'AISHE' | 'STATE_CET' | 'CENTRAL';
  reliability: 'OFFICIAL' | 'VERIFIED' | 'ESTIMATED';
  lastUpdated: string;
  methodology: string;
  url?: string;
}

// People/Mentors Module Types
export interface MentorProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  district: string;
  college: string;
  course: string;
  graduationYear: number;
  currentStatus: 'Working' | 'Higher Studies' | 'Current Student';
  currentRole?: string;
  currentOrganization?: string;
  isVerified: boolean;
  avatarUrl?: string;
  languages: ('EN' | 'HI' | 'UR')[];
  helpOfferings: string[];
  availability: 'High' | 'Medium' | 'Low';
  responseTime: string; // e.g., "Usually responds within 2 hours"
  lastActive: string;
  profileUpdated: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  consentGiven: boolean;
  isBlocked: boolean;
  phoneNumber?: string;
}

export interface ConsentRecord {
  mentorId: string;
  userId: string;
  purpose: string;
  dataRevealed: string[];
  consentGivenAt: string;
  consentWithdrawnAt?: string;
  isActive: boolean;
}

export interface MessageThread {
  id: string;
  mentorId: string;
  userId: string;
  consentId: string;
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
  isReported: boolean;
  isBlocked: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'system';
}

// Filter Types
export interface PeopleFilters {
  district?: string;
  course?: string;
  language?: 'EN' | 'HI' | 'UR';
  scope: 'District' | 'Adjacent' | 'State';
  status: ('Working' | 'Higher Studies' | 'Current Student')[];
}

// Outcomes with proper sources
export interface OutcomeData {
  working: {
    percentage: number;
    source: string;
    methodology: string;
    lastUpdated: string;
    academicYear: string;
  };
  higherStudies: {
    percentage: number;
    source: string;
    methodology: string;
    lastUpdated: string;
    academicYear: string;
  };
}

// Government UI Component Props
export interface GovBadgeProps {
  children: React.ReactNode;
  variant: 'verified' | 'official' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export interface GovChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filter' | 'status' | 'category';
}

export interface ConsentModalProps {
  isVisible: boolean;
  mentorName: string;
  purpose: string;
  dataToReveal: string[];
  onAccept: () => void;
  onDecline: () => void;
  onWithdraw?: () => void;
}