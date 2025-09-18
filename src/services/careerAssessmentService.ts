// Simple Career Assessment Service
export interface AssessmentQuestion {
  id: number;
  question: string;
  options: AssessmentOption[];
  category: 'interests' | 'skills' | 'preferences' | 'values';
}

export interface AssessmentOption {
  text: string;
  value: string;
  weights: CareerWeights;
}

export interface CareerWeights {
  medical: number;
  engineering: number;
  teaching: number;
  business: number;
  arts: number;
  civil_service: number;
  agriculture: number;
}

export interface CareerResult {
  career: string;
  percentage: number;
  description: string;
  requiredStream: string;
  colleges: string[];
  entranceExams: string[];
  salaryRange: string;
}

export interface AssessmentReport {
  topCareers: CareerResult[];
  personalityType: string;
  recommendations: string[];
  nextSteps: string[];
}

class CareerAssessmentService {
  private questions: AssessmentQuestion[] = [
    {
      id: 1,
      question: "What kind of activities do you enjoy most?",
      category: 'interests',
      options: [
        {
          text: "Helping sick people and solving health problems",
          value: "helping_health",
          weights: { medical: 5, engineering: 0, teaching: 2, business: 0, arts: 0, civil_service: 1, agriculture: 0 }
        },
        {
          text: "Building things and solving technical problems",
          value: "building_technical",
          weights: { medical: 0, engineering: 5, teaching: 1, business: 2, arts: 0, civil_service: 1, agriculture: 2 }
        },
        {
          text: "Teaching and explaining things to others",
          value: "teaching_explaining",
          weights: { medical: 1, engineering: 1, teaching: 5, business: 1, arts: 2, civil_service: 3, agriculture: 1 }
        },
        {
          text: "Managing people and making business deals",
          value: "managing_business",
          weights: { medical: 0, engineering: 1, teaching: 1, business: 5, arts: 1, civil_service: 2, agriculture: 2 }
        }
      ]
    },
    {
      id: 2,
      question: "Which subjects do you find most interesting?",
      category: 'interests',
      options: [
        {
          text: "Biology, Chemistry, Physics (Science)",
          value: "science_subjects",
          weights: { medical: 4, engineering: 3, teaching: 2, business: 0, arts: 0, civil_service: 1, agriculture: 3 }
        },
        {
          text: "Mathematics, Physics, Computer Science",
          value: "math_subjects",
          weights: { medical: 1, engineering: 5, teaching: 2, business: 2, arts: 0, civil_service: 1, agriculture: 1 }
        },
        {
          text: "History, Political Science, Economics",
          value: "social_subjects",
          weights: { medical: 0, engineering: 0, teaching: 3, business: 3, arts: 2, civil_service: 5, agriculture: 1 }
        },
        {
          text: "Arts, Literature, Languages",
          value: "arts_subjects",
          weights: { medical: 0, engineering: 0, teaching: 4, business: 1, arts: 5, civil_service: 2, agriculture: 0 }
        }
      ]
    },
    {
      id: 3,
      question: "What kind of work environment do you prefer?",
      category: 'preferences',
      options: [
        {
          text: "Hospitals, clinics, helping patients",
          value: "hospital_environment",
          weights: { medical: 5, engineering: 0, teaching: 1, business: 0, arts: 0, civil_service: 0, agriculture: 0 }
        },
        {
          text: "Offices, labs, working with technology",
          value: "office_tech",
          weights: { medical: 1, engineering: 4, teaching: 1, business: 3, arts: 1, civil_service: 2, agriculture: 1 }
        },
        {
          text: "Schools, colleges, teaching students",
          value: "educational_environment",
          weights: { medical: 1, engineering: 1, teaching: 5, business: 1, arts: 3, civil_service: 2, agriculture: 1 }
        },
        {
          text: "Markets, offices, meeting people for business",
          value: "business_environment",
          weights: { medical: 0, engineering: 1, teaching: 1, business: 5, arts: 2, civil_service: 2, agriculture: 2 }
        }
      ]
    },
    {
      id: 4,
      question: "What motivates you the most?",
      category: 'values',
      options: [
        {
          text: "Saving lives and helping people get better",
          value: "saving_lives",
          weights: { medical: 5, engineering: 0, teaching: 2, business: 0, arts: 1, civil_service: 3, agriculture: 1 }
        },
        {
          text: "Creating new technology and innovations",
          value: "innovation",
          weights: { medical: 2, engineering: 5, teaching: 1, business: 2, arts: 2, civil_service: 1, agriculture: 2 }
        },
        {
          text: "Making good money and being successful",
          value: "money_success",
          weights: { medical: 3, engineering: 3, teaching: 1, business: 5, arts: 1, civil_service: 2, agriculture: 2 }
        },
        {
          text: "Serving the country and helping society",
          value: "serving_country",
          weights: { medical: 3, engineering: 2, teaching: 4, business: 1, arts: 2, civil_service: 5, agriculture: 3 }
        }
      ]
    },
    {
      id: 5,
      question: "Which activity would you choose for a weekend?",
      category: 'skills',
      options: [
        {
          text: "Reading about diseases and health tips",
          value: "health_reading",
          weights: { medical: 4, engineering: 0, teaching: 1, business: 0, arts: 0, civil_service: 1, agriculture: 1 }
        },
        {
          text: "Building or fixing electronic gadgets",
          value: "building_gadgets",
          weights: { medical: 0, engineering: 4, teaching: 1, business: 1, arts: 1, civil_service: 0, agriculture: 1 }
        },
        {
          text: "Helping friends with their studies",
          value: "helping_studies",
          weights: { medical: 1, engineering: 1, teaching: 4, business: 1, arts: 2, civil_service: 2, agriculture: 1 }
        },
        {
          text: "Planning events or small business ideas",
          value: "planning_business",
          weights: { medical: 0, engineering: 1, teaching: 1, business: 4, arts: 1, civil_service: 2, agriculture: 2 }
        }
      ]
    }
  ];

  private careerDetails = {
    medical: {
      career: "Medical Doctor",
      description: "Treat patients, save lives, work in hospitals and clinics",
      requiredStream: "Science (Biology, Chemistry, Physics)",
      colleges: ["GMC Srinagar", "GMC Jammu", "SKIMS"],
      entranceExams: ["NEET"],
      salaryRange: "₹50,000 - ₹2,00,000+ per month"
    },
    engineering: {
      career: "Engineer",
      description: "Design and build technology, solve technical problems",
      requiredStream: "Science (Physics, Chemistry, Maths)",
      colleges: ["NIT Srinagar", "IIIT Kashmir", "GCET"],
      entranceExams: ["JEE Main", "JEE Advanced"],
      salaryRange: "₹40,000 - ₹1,50,000+ per month"
    },
    teaching: {
      career: "Teacher/Professor",
      description: "Educate students, shape future generations",
      requiredStream: "Any stream + B.Ed",
      colleges: ["Kashmir University", "Jammu University"],
      entranceExams: ["TET", "NET", "SET"],
      salaryRange: "₹25,000 - ₹80,000+ per month"
    },
    business: {
      career: "Business/Entrepreneur",
      description: "Run businesses, manage companies, create jobs",
      requiredStream: "Commerce (preferred) or any stream",
      colleges: ["Kashmir University", "Various Business Schools"],
      entranceExams: ["CAT (for MBA)", "Various management exams"],
      salaryRange: "₹30,000 - ₹5,00,000+ per month"
    },
    arts: {
      career: "Artist/Creative Professional",
      description: "Create art, content, entertainment, media",
      requiredStream: "Arts/Fine Arts",
      colleges: ["Various Art Schools", "Media Colleges"],
      entranceExams: ["Portfolio-based admissions"],
      salaryRange: "₹20,000 - ₹1,00,000+ per month"
    },
    civil_service: {
      career: "Civil Service/Government Officer",
      description: "Serve the public, work in government departments",
      requiredStream: "Any stream (Graduation required)",
      colleges: ["Any graduation college"],
      entranceExams: ["UPSC", "JKPSC", "SSC"],
      salaryRange: "₹40,000 - ₹2,50,000+ per month"
    },
    agriculture: {
      career: "Agriculture/Farming",
      description: "Modern farming, agricultural business, food production",
      requiredStream: "Science (preferred) or any stream",
      colleges: ["SKUAST Kashmir", "SKUAST Jammu"],
      entranceExams: ["Various agricultural entrance exams"],
      salaryRange: "₹25,000 - ₹1,00,000+ per month"
    }
  };

  // Get all questions for the assessment
  getQuestions(): AssessmentQuestion[] {
    return this.questions;
  }

  // Calculate career percentages based on answers
  calculateCareerMatch(answers: { questionId: number; selectedOption: string }[]): AssessmentReport {
    const careerScores: CareerWeights = {
      medical: 0,
      engineering: 0,
      teaching: 0,
      business: 0,
      arts: 0,
      civil_service: 0,
      agriculture: 0
    };

    // Calculate total scores based on answers
    answers.forEach(answer => {
      const question = this.questions.find(q => q.id === answer.questionId);
      if (question) {
        const option = question.options.find(opt => opt.value === answer.selectedOption);
        if (option) {
          // Add weighted scores
          Object.keys(careerScores).forEach(career => {
            careerScores[career as keyof CareerWeights] += option.weights[career as keyof CareerWeights];
          });
        }
      }
    });

    // Calculate total points and percentages
    const totalPoints = Object.values(careerScores).reduce((sum, score) => sum + score, 0);
    
    const careerResults: CareerResult[] = Object.entries(careerScores)
      .map(([career, score]) => ({
        ...this.careerDetails[career as keyof typeof this.careerDetails],
        percentage: totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Generate personality type and recommendations
    const topCareer = careerResults[0];
    const personalityType = this.getPersonalityType(topCareer.career);
    const recommendations = this.getRecommendations(careerResults);
    const nextSteps = this.getNextSteps(topCareer);

    return {
      topCareers: careerResults.filter(career => career.percentage > 0),
      personalityType,
      recommendations,
      nextSteps
    };
  }

  private getPersonalityType(topCareer: string): string {
    const personalityMap: { [key: string]: string } = {
      "Medical Doctor": "Helper - You care about people's wellbeing and want to make a difference in their lives.",
      "Engineer": "Builder - You love solving problems and creating solutions that help society.",
      "Teacher/Professor": "Guide - You enjoy sharing knowledge and helping others learn and grow.",
      "Business/Entrepreneur": "Leader - You have natural leadership skills and business mindset.",
      "Artist/Creative Professional": "Creator - You have artistic talents and creative vision.",
      "Civil Service/Government Officer": "Server - You want to serve the public and contribute to society.",
      "Agriculture/Farming": "Nurturer - You care about food security and sustainable development."
    };
    return personalityMap[topCareer] || "Explorer - You have diverse interests and multiple talents.";
  }

  private getRecommendations(careers: CareerResult[]): string[] {
    const top3 = careers.slice(0, 3);
    return [
      `Your strongest match is ${top3[0]?.career} (${top3[0]?.percentage}%)`,
      `Consider also exploring ${top3[1]?.career} (${top3[1]?.percentage}%) as an alternative`,
      `You also show interest in ${top3[2]?.career} (${top3[2]?.percentage}%)`,
      "Talk to professionals in these fields to learn more",
      "Consider job shadowing or internships in your top choices"
    ];
  }

  private getNextSteps(topCareer: CareerResult): string[] {
    return [
      `Choose ${topCareer.requiredStream} stream in 11th class`,
      `Research colleges: ${topCareer.colleges.join(', ')}`,
      `Prepare for entrance exams: ${topCareer.entranceExams.join(', ')}`,
      `Expected salary range: ${topCareer.salaryRange}`,
      "Connect with professionals in this field for guidance",
      "Look for scholarships and financial aid options in J&K"
    ];
  }

  // Get a specific question by ID
  getQuestion(id: number): AssessmentQuestion | undefined {
    return this.questions.find(q => q.id === id);
  }

  // Get total number of questions
  getTotalQuestions(): number {
    return this.questions.length;
  }
}

// Export singleton instance
export const careerAssessmentService = new CareerAssessmentService();