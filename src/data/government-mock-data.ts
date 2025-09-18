import { DistrictAdmitData, MentorProfile, AdmissionSource, OutcomeData } from '../types/government-modules';

// District Admits Mock Data
export const districtAdmitsData: DistrictAdmitData[] = [
  {
    district: 'Srinagar',
    college: 'Govt College for Women',
    course: 'B.Sc Biology',
    academicYear: '2024-25',
    admitCount: 45,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  {
    district: 'Srinagar',
    college: 'SP College',
    course: 'B.Sc Physics',
    academicYear: '2024-25',
    admitCount: 32,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  {
    district: 'Srinagar',
    college: 'Government College of Engineering & Technology',
    course: 'B.Tech CSE',
    academicYear: '2024-25',
    admitCount: 28,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Engineering_Merit_2024.pdf',
    lastUpdated: '2024-08-20',
    round: 'Round 1'
  },
  {
    district: 'Jammu',
    college: 'Govt College for Women',
    course: 'B.Com',
    academicYear: '2024-25',
    admitCount: 38,
    source: 'JK BOPEE Notification 2024',
    lastUpdated: '2024-08-15'
  },
  // SP College admits
  {
    district: 'Srinagar',
    college: 'SP College',
    course: 'B.Com',
    academicYear: '2024-25',
    admitCount: 42,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  // Engineering College admits
  {
    district: 'Srinagar',
    college: 'Government College of Engineering & Technology',
    course: 'B.Tech Civil',
    academicYear: '2024-25',
    admitCount: 24,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Engineering_Merit_2024.pdf',
    lastUpdated: '2024-08-20',
    round: 'Round 1'
  },
  // Islamia College admits
  {
    district: 'Srinagar',
    college: 'Islamia College of Science & Commerce',
    course: 'B.Com',
    academicYear: '2024-25',
    admitCount: 35,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  {
    district: 'Srinagar',
    college: 'Islamia College of Science & Commerce',
    course: 'B.Sc Computer Science',
    academicYear: '2024-25',
    admitCount: 28,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  // Amar Singh College admits
  {
    district: 'Srinagar',
    college: 'Amar Singh College',
    course: 'BA English',
    academicYear: '2024-25',
    admitCount: 31,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  },
  {
    district: 'Srinagar',
    college: 'Amar Singh College',
    course: 'B.Sc Mathematics',
    academicYear: '2024-25',
    admitCount: 26,
    source: 'JK BOPEE Notification 2024',
    sourceFile: 'BOPEE_Merit_List_2024_Round1.pdf',
    lastUpdated: '2024-08-15',
    round: 'Round 1'
  }
];

export const admissionSources: AdmissionSource[] = [
  {
    name: 'JK BOPEE (Board of Professional Entrance Examinations)',
    type: 'BOPEE',
    reliability: 'OFFICIAL',
    lastUpdated: '2024-08-20',
    methodology: 'Official admission/selection lists with domicile field; counts reflect admits, not current enrollment. Data parsed from merit lists published on JKBOPEE official portal.',
    url: 'https://www.jkbopee.gov.in/'
  },
  {
    name: 'NIRF India Rankings',
    type: 'NIRF',
    reliability: 'VERIFIED',
    lastUpdated: '2024-04-15',
    methodology: 'Graduation outcome data based on NIRF submission parameters for placement and higher studies statistics.',
    url: 'https://www.nirfindia.org/'
  }
];

// People/Mentors Mock Data
export const mentorsData: MentorProfile[] = [
  {
    id: 'mentor_001',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    district: 'Srinagar',
    college: 'Govt College for Women',
    course: 'B.Sc Biology',
    graduationYear: 2022,
    currentStatus: 'Working',
    currentRole: 'Lab Technician',
    currentOrganization: 'SKIMS Hospital',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['Career guidance', 'Interview preparation', 'Medical field advice'],
    availability: 'High',
    responseTime: 'Usually responds within 2 hours',
    lastActive: '2024-09-13',
    profileUpdated: '2024-09-01',
    linkedinUrl: 'https://linkedin.com/in/priya-sharma',
    twitterUrl: 'https://twitter.com/priya_sharma',
    phoneNumber: '+91-194-2345678',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_002',
    name: 'Aamir Khan',
    district: 'Srinagar',
    college: 'SP College',
    course: 'B.Com',
    graduationYear: 2023,
    currentStatus: 'Higher Studies',
    currentRole: 'MBA Student',
    currentOrganization: 'IIM Jammu',
    isVerified: true,
    languages: ['EN', 'UR'],
    helpOfferings: ['Business studies', 'MBA preparation', 'Finance career'],
    availability: 'Medium',
    responseTime: 'Usually responds within 6 hours',
    lastActive: '2024-09-12',
    profileUpdated: '2024-08-15',
    linkedinUrl: 'https://linkedin.com/in/aamir-khan',
    twitterUrl: 'https://twitter.com/aamir_khan',
    phoneNumber: '+91-194-2345679',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_003',
    name: 'Rukhsana Ali',
    district: 'Srinagar',
    college: 'Govt College for Women',
    course: 'BA English',
    graduationYear: 2021,
    currentStatus: 'Working',
    currentRole: 'Content Writer',
    currentOrganization: 'Tech Startup',
    isVerified: true,
    languages: ['EN', 'UR'],
    helpOfferings: ['Writing skills', 'Content career', 'English literature'],
    availability: 'High',
    responseTime: 'Usually responds within 1 hour',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-10',
    linkedinUrl: 'https://linkedin.com/in/rukhsana-ali',
    twitterUrl: 'https://twitter.com/rukhsana_ali',
    phoneNumber: '+91-194-2345680',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_004',
    name: 'Adil Ahmed',
    district: 'Srinagar',
    college: 'Government College of Engineering & Technology',
    course: 'B.Tech CSE',
    graduationYear: 2020,
    currentStatus: 'Working',
    currentRole: 'Software Engineer',
    currentOrganization: 'Google India',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['Programming', 'Tech interviews', 'Career in IT'],
    availability: 'Medium',
    responseTime: 'Usually responds within 4 hours',
    lastActive: '2024-09-11',
    profileUpdated: '2024-08-20',
    linkedinUrl: 'https://linkedin.com/in/adil-ahmed',
    twitterUrl: 'https://twitter.com/adil_ahmed',
    phoneNumber: '+91-194-2345681',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_005',
    name: 'Sana Mir',
    district: 'Srinagar',
    college: 'Govt College for Women',
    course: 'B.Sc Biology',
    graduationYear: 2024,
    currentStatus: 'Current Student',
    currentRole: 'NEET Aspirant',
    isVerified: false,
    languages: ['EN', 'HI'],
    helpOfferings: ['NEET preparation', 'Biology concepts'],
    availability: 'High',
    responseTime: 'Usually responds within 3 hours',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-05',
    linkedinUrl: 'https://linkedin.com/in/sana-mir',
    phoneNumber: '+91-194-2345682',
    consentGiven: true,
    isBlocked: false
  },
  // SP College Mentors
  {
    id: 'mentor_006',
    name: 'Farhan Sheikh',
    district: 'Srinagar',
    college: 'SP College',
    course: 'B.Sc Physics',
    graduationYear: 2021,
    currentStatus: 'Working',
    currentRole: 'Research Scientist',
    currentOrganization: 'DRDO',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['Physics research', 'Lab techniques', 'Government jobs'],
    availability: 'Medium',
    responseTime: 'Usually responds within 4 hours',
    lastActive: '2024-09-13',
    profileUpdated: '2024-08-30',
    linkedinUrl: 'https://linkedin.com/in/farhan-sheikh',
    twitterUrl: 'https://twitter.com/farhan_physics',
    phoneNumber: '+91-194-2345683',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_007',
    name: 'Rashida Bano',
    district: 'Srinagar',
    college: 'SP College',
    course: 'B.Com',
    graduationYear: 2020,
    currentStatus: 'Working',
    currentRole: 'Bank Manager',
    currentOrganization: 'J&K Bank',
    isVerified: true,
    languages: ['EN', 'HI', 'UR'],
    helpOfferings: ['Banking career', 'Financial planning', 'Commerce studies'],
    availability: 'High',
    responseTime: 'Usually responds within 2 hours',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-08',
    linkedinUrl: 'https://linkedin.com/in/rashida-bano',
    twitterUrl: 'https://twitter.com/rashida_banking',
    phoneNumber: '+91-194-2345684',
    consentGiven: true,
    isBlocked: false
  },
  // Government College of Engineering & Technology Mentors
  {
    id: 'mentor_008',
    name: 'Tariq Ahmad',
    district: 'Srinagar',
    college: 'Government College of Engineering & Technology',
    course: 'B.Tech CSE',
    graduationYear: 2019,
    currentStatus: 'Working',
    currentRole: 'Senior Software Engineer',
    currentOrganization: 'Microsoft',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['Software development', 'System design', 'Tech interviews'],
    availability: 'Medium',
    responseTime: 'Usually responds within 6 hours',
    lastActive: '2024-09-12',
    profileUpdated: '2024-09-01',
    linkedinUrl: 'https://linkedin.com/in/tariq-ahmad',
    twitterUrl: 'https://twitter.com/tariq_codes',
    phoneNumber: '+91-194-2345685',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_009',
    name: 'Shabnam Khatoon',
    district: 'Srinagar',
    college: 'Government College of Engineering & Technology',
    course: 'B.Tech Civil',
    graduationYear: 2022,
    currentStatus: 'Working',
    currentRole: 'Civil Engineer',
    currentOrganization: 'PWD J&K',
    isVerified: true,
    languages: ['EN', 'HI', 'UR'],
    helpOfferings: ['Civil engineering', 'Construction planning', 'Government engineering jobs'],
    availability: 'High',
    responseTime: 'Usually responds within 3 hours',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-05',
    linkedinUrl: 'https://linkedin.com/in/shabnam-khatoon',
    phoneNumber: '+91-194-2345686',
    consentGiven: true,
    isBlocked: false
  },
  // Islamia College Mentors
  {
    id: 'mentor_010',
    name: 'Mohammad Yaseen',
    district: 'Srinagar',
    college: 'Islamia College of Science & Commerce',
    course: 'B.Com',
    graduationYear: 2021,
    currentStatus: 'Working',
    currentRole: 'Chartered Accountant',
    currentOrganization: 'Ernst & Young',
    isVerified: true,
    languages: ['EN', 'HI', 'UR'],
    helpOfferings: ['Accounting', 'CA preparation', 'Finance career'],
    availability: 'Medium',
    responseTime: 'Usually responds within 5 hours',
    lastActive: '2024-09-13',
    profileUpdated: '2024-08-28',
    linkedinUrl: 'https://linkedin.com/in/mohammad-yaseen',
    twitterUrl: 'https://twitter.com/yaseen_ca',
    phoneNumber: '+91-194-2345687',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_011',
    name: 'Nusrat Jan',
    district: 'Srinagar',
    college: 'Islamia College of Science & Commerce',
    course: 'B.Sc Computer Science',
    graduationYear: 2023,
    currentStatus: 'Higher Studies',
    currentRole: 'MCA Student',
    currentOrganization: 'NIT Srinagar',
    isVerified: true,
    languages: ['EN', 'HI', 'UR'],
    helpOfferings: ['Computer science', 'Programming basics', 'Higher studies guidance'],
    availability: 'High',
    responseTime: 'Usually responds within 1 hour',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-10',
    linkedinUrl: 'https://linkedin.com/in/nusrat-jan',
    phoneNumber: '+91-194-2345688',
    consentGiven: true,
    isBlocked: false
  },
  // Amar Singh College Mentors
  {
    id: 'mentor_012',
    name: 'Vikram Singh',
    district: 'Srinagar',
    college: 'Amar Singh College',
    course: 'BA English',
    graduationYear: 2020,
    currentStatus: 'Working',
    currentRole: 'English Teacher',
    currentOrganization: 'Kendriya Vidyalaya',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['English literature', 'Teaching career', 'Competitive exams'],
    availability: 'High',
    responseTime: 'Usually responds within 2 hours',
    lastActive: '2024-09-14',
    profileUpdated: '2024-09-03',
    linkedinUrl: 'https://linkedin.com/in/vikram-singh',
    twitterUrl: 'https://twitter.com/vikram_teaches',
    phoneNumber: '+91-194-2345689',
    consentGiven: true,
    isBlocked: false
  },
  {
    id: 'mentor_013',
    name: 'Deepika Sharma',
    district: 'Srinagar',
    college: 'Amar Singh College',
    course: 'B.Sc Mathematics',
    graduationYear: 2022,
    currentStatus: 'Higher Studies',
    currentRole: 'MSc Student',
    currentOrganization: 'Kashmir University',
    isVerified: true,
    languages: ['EN', 'HI'],
    helpOfferings: ['Mathematics', 'Research methods', 'Academic writing'],
    availability: 'Medium',
    responseTime: 'Usually responds within 4 hours',
    lastActive: '2024-09-13',
    profileUpdated: '2024-08-25',
    linkedinUrl: 'https://linkedin.com/in/deepika-sharma',
    phoneNumber: '+91-194-2345690',
    consentGiven: true,
    isBlocked: false
  }
];

// Enhanced Outcomes Data with proper sources
export const enhancedOutcomesData: OutcomeData = {
  working: {
    percentage: 78,
    source: 'NIRF India Rankings 2024',
    methodology: 'Based on NIRF submission parameters for graduate employment within 6 months of graduation',
    lastUpdated: '2024-04-15',
    academicYear: '2023-24'
  },
  higherStudies: {
    percentage: 22,
    source: 'NIRF India Rankings 2024',
    methodology: 'Based on NIRF submission parameters for graduates pursuing higher education',
    lastUpdated: '2024-04-15',
    academicYear: '2023-24'
  },
};

// Helper functions to get data
export const getDistrictAdmits = (district: string, college: string, course: string) => {
  return districtAdmitsData.filter(admit => 
    admit.district === district && 
    admit.college === college && 
    admit.course === course
  );
};

export const getCollegeMentors = (college: string, limit?: number) => {
  const mentors = mentorsData.filter(mentor => mentor.college === college);
  return limit ? mentors.slice(0, limit) : mentors;
};

export const getMentorsByDistrict = (district: string) => {
  return mentorsData.filter(mentor => mentor.district === district);
};

export const getMentorById = (id: string) => {
  return mentorsData.find(mentor => mentor.id === id);
};

export const getAdmissionSource = (sourceName: string) => {
  return admissionSources.find(source => source.name === sourceName);
};