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

export interface Mentor {
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
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  achievements: string[];
  isAvailableForChat: boolean;
  responseTime: string;
  helpedStudents: number;
  rating: number;
  linkedInUrl?: string;
  emailVisible: boolean;
  phoneVisible: boolean;
  // New fields for enhanced student/alumni features
  currentStatus: 'Current Student' | 'Alumni' | 'Working';
  academicYear?: string; // For current students
  shortBio: string; // Short intro for cards
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
}

export const mentorsData: Mentor[] = [
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
      },
      {
        id: 'w3',
        company: 'Flipkart',
        position: 'Associate Software Engineer',
        duration: '2016 - 2018',
        location: 'Bangalore, India',
        description: 'Started career in e-commerce. Worked on recommendation systems.',
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
    name: 'Rahul Kumar',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2012',
    currentRole: 'Senior Teacher',
    currentCompany: 'Delhi Public School',
    totalExperience: '12 years',
    bio: 'Passionate educator with 12 years of teaching experience. Specialized in NEET preparation and have helped 200+ students crack medical entrance exams.',
    shortBio: 'Senior Biology Teacher • NEET Expert • 95% Success Rate',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rahulkumar',
      whatsapp: '+91-8765432109'
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
    skills: ['Biology Teaching', 'NEET Preparation', 'Student Mentoring', 'Curriculum Design'],
    workExperience: [
      {
        id: 'w4',
        company: 'Delhi Public School',
        position: 'Senior Biology Teacher',
        duration: '2019 - Present',
        location: 'New Delhi, India',
        description: 'Teaching grades 11-12. NEET coordinator. 95% success rate in medical entrance.',
        isCurrentRole: true
      },
      {
        id: 'w5',
        company: 'Aakash Institute',
        position: 'Faculty - Biology',
        duration: '2016 - 2019',
        location: 'Delhi, India',
        description: 'Taught NEET aspirants. Developed study materials and mock tests.',
        isCurrentRole: false
      },
      {
        id: 'w6',
        company: 'Local Coaching Center',
        position: 'Biology Teacher',
        duration: '2012 - 2016',
        location: 'Srinagar, J&K',
        description: 'Started teaching career in hometown. Built strong foundation in pedagogy.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e2',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2012',
        grade: '91%'
      },
      {
        id: 'e3',
        institution: 'University of Kashmir',
        degree: 'M.Sc',
        field: 'Zoology',
        year: '2014',
        grade: '87%'
      }
    ],
    achievements: [
      'Best Teacher Award 2023',
      'NEET Success Rate 95% (2020-2023)',
      'Published research in peer-reviewed journals'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 4 hours',
    helpedStudents: 89,
    rating: 4.8,
    emailVisible: true,
    phoneVisible: true
  },
  {
    id: '3',
    name: 'Sneha Patel',
    isVerified: false,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2016',
    currentRole: 'Research Scientist',
    currentCompany: 'CSIR-IIIM',
    totalExperience: '8 years',
    bio: 'Research scientist working on drug discovery. Pursuing PhD while working. Love helping students understand the research pathway in life sciences.',
    shortBio: 'Research Scientist • PhD Scholar • Drug Discovery Expert',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/snehapatel'
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
    skills: ['Research', 'Drug Discovery', 'Laboratory Techniques', 'Scientific Writing'],
    workExperience: [
      {
        id: 'w7',
        company: 'CSIR-IIIM',
        position: 'Research Scientist',
        duration: '2020 - Present',
        location: 'Jammu, J&K',
        description: 'Working on natural product drug discovery. Leading a small research team.',
        isCurrentRole: true
      },
      {
        id: 'w8',
        company: 'Indian Institute of Science',
        position: 'Research Associate',
        duration: '2018 - 2020',
        location: 'Bangalore, India',
        description: 'Post-graduate research in molecular biology. Published 3 research papers.',
        isCurrentRole: false
      },
      {
        id: 'w9',
        company: 'Biocon Ltd',
        position: 'Junior Research Associate',
        duration: '2016 - 2018',
        location: 'Bangalore, India',
        description: 'Entry-level position in biotechnology industry. Gained industry experience.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e4',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2016',
        grade: '88%'
      },
      {
        id: 'e5',
        institution: 'Indian Institute of Science',
        degree: 'M.Sc',
        field: 'Molecular Biology',
        year: '2018',
        grade: '8.5/10'
      },
      {
        id: 'e6',
        institution: 'University of Kashmir',
        degree: 'PhD (Pursuing)',
        field: 'Biotechnology',
        year: '2024 (Expected)',
        grade: 'Ongoing'
      }
    ],
    achievements: [
      'Published 5 research papers',
      'CSIR-NET Qualified',
      'Young Scientist Award 2023'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 6 hours',
    helpedStudents: 34,
    rating: 4.6,
    emailVisible: false,
    phoneVisible: false
  },
  {
    id: '4',
    name: 'Amit Singh',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2010',
    currentRole: 'Medical Officer',
    currentCompany: 'AIIMS Delhi',
    totalExperience: '14 years',
    bio: 'Medical doctor specializing in internal medicine. Cleared NEET in first attempt after B.Sc Biology. Happy to guide students on medical career path.',
    shortBio: 'Medical Doctor • NEET Expert • AIIMS Delhi',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/amitsingh',
      whatsapp: '+91-9876543211'
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
      },
      {
        id: 'w11',
        company: 'GMC Srinagar',
        position: 'Junior Resident',
        duration: '2016 - 2020',
        location: 'Srinagar, J&K',
        description: 'Completed residency in hometown. Gained valuable clinical experience.',
        isCurrentRole: false
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
      },
      {
        id: 'e9',
        institution: 'AIIMS Delhi',
        degree: 'MD',
        field: 'Internal Medicine',
        year: '2020',
        grade: 'Distinction'
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
    linkedInUrl: 'https://linkedin.com/in/amitsingh',
    emailVisible: true,
    phoneVisible: true
  },
  {
    id: '5',
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
    shortBio: 'Biology to Data Science • Amazon ML Engineer • Career Transition Expert',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priyadevi',
      twitter: 'https://twitter.com/priyadevi'
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
      },
      {
        id: 'w13',
        company: 'Netflix',
        position: 'Data Scientist',
        duration: '2019 - 2022',
        location: 'Los Angeles, USA',
        description: 'Built recommendation models for content discovery. A/B testing expert.',
        isCurrentRole: false
      },
      {
        id: 'w14',
        company: 'Ola',
        position: 'Data Analyst',
        duration: '2017 - 2019',
        location: 'Bangalore, India',
        description: 'Started data science career. Worked on demand forecasting and pricing.',
        isCurrentRole: false
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
      },
      {
        id: 'e11',
        institution: 'Indian Statistical Institute',
        degree: 'Post Graduate Diploma',
        field: 'Data Science',
        year: '2017',
        grade: '8.7/10'
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
    linkedInUrl: 'https://linkedin.com/in/priyadevi',
    emailVisible: true,
    phoneVisible: false
  },
  {
    id: '6',
    name: 'Vikash Sharma',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2013',
    currentRole: 'Entrepreneur',
    currentCompany: 'BioPharma Solutions (Founder)',
    totalExperience: '11 years',
    bio: 'Founded a biotech startup focusing on diagnostic solutions. Previously worked in pharma industry. Passionate about helping students explore entrepreneurship in life sciences.',
    shortBio: 'Biotech Entrepreneur • Startup Founder • Pharma Expert',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/vikashsharma',
      twitter: 'https://twitter.com/vikashsharma'
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
    skills: ['Entrepreneurship', 'Business Development', 'Biotechnology', 'Leadership'],
    workExperience: [
      {
        id: 'w15',
        company: 'BioPharma Solutions',
        position: 'Founder & CEO',
        duration: '2019 - Present',
        location: 'Pune, India',
        description: 'Building diagnostic solutions for rural healthcare. Team of 25 people.',
        isCurrentRole: true
      },
      {
        id: 'w16',
        company: 'Cipla Ltd',
        position: 'Product Manager',
        duration: '2016 - 2019',
        location: 'Mumbai, India',
        description: 'Managed product portfolio worth ₹100 crores. Led market expansion.',
        isCurrentRole: false
      },
      {
        id: 'w17',
        company: 'Dr. Reddy\'s Labs',
        position: 'Associate Scientist',
        duration: '2013 - 2016',
        location: 'Hyderabad, India',
        description: 'Started career in pharmaceutical R&D. Worked on drug formulations.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e12',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2013',
        grade: '84%'
      },
      {
        id: 'e13',
        institution: 'NIPER Mohali',
        degree: 'M.S',
        field: 'Pharmaceutical Technology',
        year: '2015',
        grade: '8.2/10'
      }
    ],
    achievements: [
      'Started company valued at ₹50 crores',
      'Forbes 30 Under 30 - Healthcare 2022',
      'Filed 3 patents in diagnostic technology'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 8 hours',
    helpedStudents: 67,
    rating: 4.8,
    linkedInUrl: 'https://linkedin.com/in/vikashsharma',
    emailVisible: true,
    phoneVisible: true
  },
  {
    id: '7',
    name: 'Kavita Singh',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2017',
    currentRole: 'Product Manager',
    currentCompany: 'Zomato',
    totalExperience: '7 years',
    bio: 'Product manager at Zomato working on food delivery optimization. Transitioned from biology to tech through self-learning and bootcamps. Love helping students navigate career changes.',
    shortBio: 'Biology to Product Management • Zomato PM • Career Transition Guide',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/kavitasingh',
      twitter: 'https://twitter.com/kavitasingh'
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
    skills: ['Product Management', 'Data Analysis', 'User Research', 'Agile'],
    workExperience: [
      {
        id: 'w18',
        company: 'Zomato',
        position: 'Senior Product Manager',
        duration: '2022 - Present',
        location: 'Gurgaon, India',
        description: 'Leading delivery optimization initiatives. Managing a team of 5 product managers.',
        isCurrentRole: true
      },
      {
        id: 'w19',
        company: 'Swiggy',
        position: 'Product Manager',
        duration: '2020 - 2022',
        location: 'Bangalore, India',
        description: 'Worked on restaurant onboarding and discovery features.',
        isCurrentRole: false
      },
      {
        id: 'w20',
        company: 'Paytm',
        position: 'Associate Product Manager',
        duration: '2018 - 2020',
        location: 'Noida, India',
        description: 'Started product career in fintech. Worked on payments and wallet features.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e14',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2017',
        grade: '89%'
      },
      {
        id: 'e15',
        institution: 'IIM Bangalore',
        degree: 'PGP',
        field: 'Product Management',
        year: '2018',
        grade: '8.5/10'
      }
    ],
    achievements: [
      'Zomato Top Performer 2023',
      'Product Hunt Feature 2022',
      'Mentored 40+ career changers'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 4 hours',
    helpedStudents: 45,
    rating: 4.6,
    linkedInUrl: 'https://linkedin.com/in/kavitasingh',
    emailVisible: true,
    phoneVisible: false
  },
  {
    id: '8',
    name: 'Rajesh Kumar',
    isVerified: true,
    district: 'Srinagar',
    college: 'Government College for Women',
    course: 'B.Sc Biology',
    graduationYear: '2011',
    currentRole: 'Senior Consultant',
    currentCompany: 'McKinsey & Company',
    totalExperience: '13 years',
    bio: 'Management consultant at McKinsey specializing in healthcare and life sciences. Helped 100+ students with career strategy and interview preparation.',
    shortBio: 'McKinsey Consultant • Healthcare Strategy • Career Mentor',
    currentStatus: 'Working',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      twitter: 'https://twitter.com/rajeshkumar'
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
    skills: ['Strategy Consulting', 'Healthcare', 'Leadership', 'Problem Solving'],
    workExperience: [
      {
        id: 'w21',
        company: 'McKinsey & Company',
        position: 'Senior Consultant',
        duration: '2020 - Present',
        location: 'Mumbai, India',
        description: 'Leading healthcare strategy projects. Managing client relationships worth $50M+.',
        isCurrentRole: true
      },
      {
        id: 'w22',
        company: 'Deloitte',
        position: 'Consultant',
        duration: '2016 - 2020',
        location: 'Delhi, India',
        description: 'Worked on healthcare transformation projects. Led teams of 8-10 consultants.',
        isCurrentRole: false
      },
      {
        id: 'w23',
        company: 'PwC',
        position: 'Senior Associate',
        duration: '2013 - 2016',
        location: 'Mumbai, India',
        description: 'Started consulting career. Worked on pharmaceutical industry projects.',
        isCurrentRole: false
      }
    ],
    education: [
      {
        id: 'e16',
        institution: 'Government College for Women, Srinagar',
        degree: 'B.Sc',
        field: 'Biology',
        year: '2011',
        grade: '93%'
      },
      {
        id: 'e17',
        institution: 'IIM Ahmedabad',
        degree: 'PGP',
        field: 'Management',
        year: '2013',
        grade: '9.2/10'
      }
    ],
    achievements: [
      'McKinsey Partner Track 2024',
      'Healthcare Innovation Award 2023',
      'Mentored 100+ students in consulting'
    ],
    isAvailableForChat: true,
    responseTime: 'Usually responds within 6 hours',
    helpedStudents: 100,
    rating: 4.9,
    linkedInUrl: 'https://linkedin.com/in/rajeshkumar',
    emailVisible: true,
    phoneVisible: true
  }
];

// Helper functions to filter mentors
export const getMentorsByDistrict = (district: string): Mentor[] => {
  return mentorsData.filter(mentor => mentor.district === district);
};

export const getMentorsByCourse = (course: string): Mentor[] => {
  return mentorsData.filter(mentor => mentor.course === course);
};

export const getMentorsByCollegeAndCourse = (college: string, course: string): Mentor[] => {
  return mentorsData.filter(mentor => 
    mentor.college === college && mentor.course === course
  );
};

export const getMentorById = (id: string): Mentor | undefined => {
  return mentorsData.find(mentor => mentor.id === id);
};