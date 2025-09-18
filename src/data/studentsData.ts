export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  isCurrentRole: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
  grade?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  district: string;
  college: string;
  course: string;
  graduationYear: string;
  currentRole: string;
  currentCompany: string;
  totalExperience: string;
  bio: string;
  shortBio: string; // Short intro for cards
  currentStatus: 'Current Student' | 'Alumni' | 'Working';
  academicYear?: string; // For current students
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  achievements: string[];
  isAvailableForChat: boolean;
  responseTime: string;
  helpedStudents: number;
  rating: number;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  };
  contactPreferences: {
    allowMessages: boolean;
    allowCalls: boolean;
    allowLinkedIn: boolean;
  };
  privacySettings: {
    showFullName: boolean; // If false, show first name + last initial
    showEmail: boolean;
    showPhone: boolean;
  };
  linkedInUrl?: string;
  emailVisible: boolean;
  phoneVisible: boolean;
}

export const studentsData: Student[] = [
  // Working Professionals
  {
    id: '1',
    name: 'Arya Sharma',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2014',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'Google',
    totalExperience: '10 years',
    bio: 'Started as a biology student but transitioned to tech through self-learning. Now working at Google on machine learning projects. Happy to help students from my hometown navigate career transitions.',
    shortBio: 'Biology to Tech transition • Google ML Engineer • Love helping with career changes',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/aryasharma',
      twitter: 'https://twitter.com/aryasharma',
      whatsapp: '+91-9876543210'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: true,
      allowLinkedIn: true
    },
    privacySettings: {
      showFullName: true,
      showEmail: true,
      showPhone: false
    },
    skills: ['Machine Learning', 'Python', 'Data Science', 'Leadership', 'Career Transition'],
    workExperience: [
      {
        id: 'w1',
        company: 'Google',
        position: 'Senior Software Engineer',
        duration: '2021 - Present',
        location: 'Bangalore, India',
        description: 'Leading ML initiatives for search ranking. Managing a team of 8 engineers.',
        isCurrentRole: true
      },
      {
        id: 'w2',
        company: 'Microsoft',
        position: 'Software Engineer',
        duration: '2018 - 2021',
        location: 'Hyderabad, India',
        description: 'Worked on Azure ML services. Built scalable data pipelines.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e1',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2014',
        grade: '85%'
      }
    ],
    achievements: [
      'Google Excellence Award 2023',
      'Microsoft Hackathon Winner 2020',
      'Mentored 50+ students in career transition'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 2 hours',
    helpedStudents: 127,
    rating: 4.9,
    linkedInUrl: 'https://linkedin.com/in/aryasharma',
    emailVisible: true,
    phoneVisible: false
  },
  {
    id: '2',
    name: 'Priya Devi',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2015',
    currentRole: 'Data Scientist',
    currentCompany: 'Amazon',
    totalExperience: '9 years',
    bio: 'Transitioned from biology to data science. Currently working at Amazon on recommendation systems. Love helping students explore unconventional career paths.',
    shortBio: 'Data Scientist at Amazon • Biology background • Career transition expert',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyadevi',
      twitter: 'https://twitter.com/priyadev',
      whatsapp: '+91-8765432109'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: false,
      allowLinkedIn: true
    },
    privacySettings: {
      showFullName: true,
      showEmail: true,
      showPhone: false
    },
    skills: ['Data Science', 'Machine Learning', 'Python', 'Statistics', 'Career Transition'],
    workExperience: [
      {
        id: 'w12',
        company: 'Amazon',
        position: 'Senior Data Scientist',
        duration: '2022 - Present',
        location: 'Seattle, USA',
        description: 'Working on personalization algorithms. Leading cross-functional projects.',
        isCurrentRole: true
      }
    ],
    education: [
      {
        id: 'e10',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2015',
        grade: '86%'
      }
    ],
    achievements: [
      'Amazon Innovation Award 2023',
      'Netflix Top Performer 2021',
      'Mentored 75+ career changers'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 3 hours',
    helpedStudents: 98,
    rating: 4.7,
    emailVisible: true,
    phoneVisible: false
  },

  // Alumni (Graduated but not necessarily working)
  {
    id: '3',
    name: 'Rahul K.',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2020',
    currentRole: 'Preparing for NEET',
    currentCompany: '',
    totalExperience: '0 years',
    bio: 'Recently graduated and preparing for NEET to pursue MBBS. Happy to share study strategies and entrance exam preparation tips with juniors.',
    shortBio: 'Recent graduate • NEET aspirant • Can help with exam prep strategies',
    currentStatus: 'Alumni',
    socialLinks: {
      whatsapp: '+91-7654321098'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: true,
      allowLinkedIn: false
    },
    privacySettings: {
      showFullName: false, // Will show as "Rahul K."
      showEmail: false,
      showPhone: false
    },
    skills: ['NEET Preparation', 'Biology', 'Study Planning', 'Time Management'],
    workExperience: [],
    education: [
      {
        id: 'e20',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2020',
        grade: '92%'
      }
    ],
    achievements: [
      'College Topper 2020',
      'Science Fair Winner',
      'Helped 15+ juniors with studies'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 1 hour',
    helpedStudents: 15,
    rating: 4.8,
    emailVisible: false,
    phoneVisible: false
  },
  {
    id: '4',
    name: 'Sneha P.',
    isVerified: false,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2019',
    currentRole: 'Pursuing Masters',
    currentCompany: 'University of Kashmir',
    totalExperience: '0 years',
    bio: 'Currently pursuing M.Sc in Biotechnology. Interested in research and planning to do PhD. Love helping juniors with academic choices.',
    shortBio: 'M.Sc Biotechnology student • Research enthusiast • Academic guidance',
    currentStatus: 'Alumni',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/snehap',
      whatsapp: '+91-6543210987'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: false,
      allowLinkedIn: true
    },
    privacySettings: {
      showFullName: false,
      showEmail: false,
      showPhone: false
    },
    skills: ['Research', 'Biotechnology', 'Laboratory Techniques', 'Academic Writing'],
    workExperience: [],
    education: [
      {
        id: 'e21',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2019',
        grade: '88%'
      },
      {
        id: 'e22',
        institution: 'University of Kashmir',
        degree: 'M.Sc (Pursuing)',
        field: 'Biotechnology',
        year: '2025 (Expected)',
        grade: 'Ongoing'
      }
    ],
    achievements: [
      'Research Paper Published',
      'University Merit Scholarship',
      'Lab Assistant Role'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 4 hours',
    helpedStudents: 22,
    rating: 4.5,
    emailVisible: false,
    phoneVisible: false
  },

  // Current Students
  {
    id: '5',
    name: 'Aisha M.',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2025',
    academicYear: '3rd Year',
    currentRole: 'Student',
    currentCompany: 'Government College for Women',
    totalExperience: '0 years',
    bio: 'Third-year biology student passionate about marine biology. Actively involved in college science club and environmental awareness programs.',
    shortBio: '3rd Year Biology • Marine biology enthusiast • Science club member',
    currentStatus: 'Current Student',
    socialLinks: {
      whatsapp: '+91-5432109876'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: true,
      allowLinkedIn: false
    },
    privacySettings: {
      showFullName: false,
      showEmail: false,
      showPhone: false
    },
    skills: ['Biology', 'Marine Science', 'Environmental Studies', 'Research'],
    workExperience: [],
    education: [
      {
        id: 'e30',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc (Pursuing)',
        field: 'Biology',
        year: '2025 (Expected)',
        grade: 'Current CGPA: 8.5'
      }
    ],
    achievements: [
      'Science Club President',
      'Best Project Award 2023',
      'Environmental Campaign Leader'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 30 minutes',
    helpedStudents: 8,
    rating: 4.6,
    emailVisible: false,
    phoneVisible: false
  },
  {
    id: '6',
    name: 'Zara Khan',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2024',
    academicYear: '2nd Year',
    currentRole: 'Student',
    currentCompany: 'Government College for Women',
    totalExperience: '0 years',
    bio: 'Second-year student interested in genetics and biotechnology. Planning to pursue higher studies in genetic engineering. Love sharing study tips and notes.',
    shortBio: '2nd Year Biology • Genetics enthusiast • Study partner available',
    currentStatus: 'Current Student',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/zarakhan',
      whatsapp: '+91-4321098765'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: false,
      allowLinkedIn: true
    },
    privacySettings: {
      showFullName: true,
      showEmail: false,
      showPhone: false
    },
    skills: ['Genetics', 'Biotechnology', 'Study Planning', 'Note Sharing'],
    workExperience: [],
    education: [
      {
        id: 'e31',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc (Pursuing)',
        field: 'Biology',
        year: '2024 (Expected)',
        grade: 'Current CGPA: 9.1'
      }
    ],
    achievements: [
      'Semester Topper (1st Year)',
      'Genetics Quiz Winner',
      'Peer Tutor Recognition'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 1 hour',
    helpedStudents: 12,
    rating: 4.7,
    emailVisible: false,
    phoneVisible: false
  },
  {
    id: '7',
    name: 'Sameer A.',
    isVerified: false,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2026',
    academicYear: '1st Year',
    currentRole: 'Student',
    currentCompany: 'Government College for Women',
    totalExperience: '0 years',
    bio: 'First-year biology student, fresh and enthusiastic about college life. Looking forward to connecting with seniors and learning from their experiences.',
    shortBio: '1st Year Biology • New to college • Eager to learn and connect',
    currentStatus: 'Current Student',
    socialLinks: {
      whatsapp: '+91-3210987654'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: true,
      allowLinkedIn: false
    },
    privacySettings: {
      showFullName: false,
      showEmail: false,
      showPhone: false
    },
    skills: ['Biology Basics', 'Eager Learner', 'Team Work'],
    workExperience: [],
    education: [
      {
        id: 'e32',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc (Pursuing)',
        field: 'Biology',
        year: '2026 (Expected)',
        grade: 'Current Semester: 1st'
      }
    ],
    achievements: [
      'College Admission Merit List',
      'School Science Fair Winner'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 15 minutes',
    helpedStudents: 2,
    rating: 4.3,
    emailVisible: false,
    phoneVisible: false
  },

  // More Working Professionals
  {
    id: '8',
    name: 'Dr. Amit Singh',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2010',
    currentRole: 'Medical Officer',
    currentCompany: 'AIIMS Delhi',
    totalExperience: '14 years',
    bio: 'Medical doctor specializing in internal medicine. Cleared NEET in first attempt after B.Sc Biology. Happy to guide students on medical career path.',
    shortBio: 'AIIMS Doctor • NEET Success Story • Medical career guidance',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/dramitsingh',
      whatsapp: '+91-2109876543'
    },
    contactPreferences: {
      allowMessages: true,
      allowCalls: true,
      allowLinkedIn: true
    },
    privacySettings: {
      showFullName: true,
      showEmail: true,
      showPhone: true
    },
    skills: ['Medicine', 'Patient Care', 'Medical Research', 'NEET Guidance'],
    workExperience: [
      {
        id: 'w10',
        company: 'AIIMS Delhi',
        position: 'Senior Resident',
        duration: '2020 - Present',
        location: 'New Delhi, India',
        description: 'Working in Internal Medicine department. Teaching medical students.',
        isCurrentRole: true
      }
    ],
    education: [
      {
        id: 'e7',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2010',
        grade: '92%'
      },
      {
        id: 'e8',
        institution: 'Government Medical College, Srinagar',
        degree: 'MBBS',
        field: 'Medicine',
        year: '2016',
        grade: '78%'
      }
    ],
    achievements: [
      'NEET All India Rank 234',
      'Best Resident Award 2019',
      'Published 8 medical research papers'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 12 hours',
    helpedStudents: 156,
    rating: 4.9,
    emailVisible: true,
    phoneVisible: true
  }
];

// Helper functions to filter students
export const getStudentsByDistrict = (district: string): Student[] => {
  return studentsData.filter(student => student.district === district);
};

export const getStudentsByCourse = (course: string): Student[] => {
  return studentsData.filter(student => student.course === course);
};

export const getStudentsByStatus = (status: 'Current Student' | 'Alumni' | 'Working'): Student[] => {
  return studentsData.filter(student => student.currentStatus === status);
};

export const getStudentsByCollegeAndCourse = (college: string, course: string): Student[] => {
  return studentsData.filter(student => 
    student.college === college && student.course === course
  );
};

export const getStudentById = (id: string): Student | undefined => {
  return studentsData.find(student => student.id === id);
};

export const getStudentDisplayName = (student: Student): string => {
  if (student.privacySettings.showFullName) {
    return student.name;
  }
  
  const nameParts = student.name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`;
  }
  return nameParts[0];
};

export const getAvatarInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getAvatarColor = (name: string): string => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};