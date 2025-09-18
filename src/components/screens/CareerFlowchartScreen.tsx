import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { GradientButton } from "../ui/gradient-button";
import { Card, CardContent } from "../ui/card";
import { colors } from '../../theme/colors';

// Import tab components
import { OverviewTab } from "../career-tabs/OverviewTab";
import { FlowTab } from "../career-tabs/FlowTab";
import { CollegesTab } from "../career-tabs/CollegesTab";
import { PeopleTab } from "../career-tabs/PeopleTab";
import { OutcomesTab } from "../career-tabs/OutcomesTab";
import { FlowchartTextOutline } from "../career-tabs/FlowchartTextOutline";

const Tab = createMaterialTopTabNavigator();

interface CareerFlowchartScreenProps {
  navigation: any;
  route?: any;
}

export function CareerFlowchartScreen({ navigation, route }: CareerFlowchartScreenProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };
  const { interests = [], formData } = route?.params || {};
  const [selectedInterest, setSelectedInterest] = useState(interests[0] || 'Engineering');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['start']);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const flowchartData = {
    Engineering: {
      start: {
        title: "Class 12 PCM",
        type: "start",
        children: ["engineering-path"]
      },
      "engineering-path": {
        title: "Engineering Pathways",
        type: "decision",
        children: ["jee-path", "state-path", "diploma-path"]
      },
      "jee-path": {
        title: "JEE Main/Advanced → IITs/NITs",
        type: "study",
        duration: "4 years",
        pros: ["Premium institutes", "Excellent placements", "Strong alumni network", "Research opportunities"],
        cons: ["Extremely high competition", "Expensive fees", "Stressful environment"],
        children: ["eng-careers"]
      },
      "state-path": {
        title: "State CET → Government/Private Colleges",
        type: "study",
        duration: "4 years",
        pros: ["Lower fees", "Local opportunities", "Less competition", "Good quality education"],
        cons: ["Limited brand value", "Fewer placement opportunities", "Regional focus"],
        children: ["eng-careers"]
      },
      "diploma-path": {
        title: "Diploma → Lateral Entry",
        type: "study",
        duration: "3+2 years",
        pros: ["Practical skills", "Faster entry", "Lower cost", "Industry ready"],
        cons: ["Limited scope", "Lower starting salary", "Less theoretical knowledge"],
        children: ["eng-careers"]
      },
      "eng-careers": {
        title: "Engineering Career Options",
        type: "paths",
        paths: [
          "Software Engineer (₹6-15L)",
          "Data Scientist (₹8-20L)",
          "Product Manager (₹10-25L)",
          "Research & Development (₹7-18L)",
          "Consulting (₹8-20L)",
          "Entrepreneurship (Variable)"
        ]
      }
    },
    Medical: {
      start: {
        title: "Class 12 PCB",
        type: "start",
        children: ["medical-path"]
      },
      "medical-path": {
        title: "Medical Pathways",
        type: "decision",
        children: ["neet-path", "alt-medical-path"]
      },
      "neet-path": {
        title: "NEET → MBBS/BDS",
        type: "study",
        duration: "5.5 years",
        pros: ["High social status", "Excellent income potential", "Job security", "Respect in society"],
        cons: ["Extremely high competition", "Very expensive", "Long duration", "High stress"],
        children: ["medical-careers"]
      },
      "alt-medical-path": {
        title: "Alternative Medical Courses",
        type: "study",
        duration: "3-4 years",
        pros: ["Lower entry barrier", "Good job prospects", "Shorter duration", "Practical skills"],
        cons: ["Lower prestige", "Limited growth", "Lower starting salary"],
        children: ["alt-medical-careers"]
      },
      "medical-careers": {
        title: "Medical Career Options",
        type: "paths",
        paths: [
          "General Practitioner (₹8-20L)",
          "Specialist Doctor (₹15-50L)",
          "Surgeon (₹20-80L)",
          "Medical Research (₹6-15L)",
          "Medical Administration (₹10-25L)"
        ]
      },
      "alt-medical-careers": {
        title: "Alternative Medical Careers",
        type: "paths",
        paths: [
          "Nursing (₹3-8L)",
          "Pharmacy (₹4-10L)",
          "Physiotherapy (₹4-12L)",
          "Medical Lab Technology (₹3-8L)",
          "Radiology Technician (₹4-10L)"
        ]
      }
    },
    Business: {
      start: {
        title: "Class 12 Any Stream",
        type: "start",
        children: ["business-path"]
      },
      "business-path": {
        title: "Business Education Pathways",
        type: "decision",
        children: ["bba-path", "bcom-path", "entrepreneur-path"]
      },
      "bba-path": {
        title: "BBA → MBA",
        type: "study",
        duration: "3+2 years",
        pros: ["Management focus", "Good networking", "Leadership skills", "High earning potential"],
        cons: ["Expensive MBA", "High competition", "Requires work experience"],
        children: ["business-careers"]
      },
      "bcom-path": {
        title: "B.Com → CA/CS/CMA",
        type: "study",
        duration: "3+3 years",
        pros: ["Professional qualification", "High demand", "Good salary", "Job security"],
        cons: ["Very difficult exams", "Long duration", "High stress"],
        children: ["finance-careers"]
      },
      "entrepreneur-path": {
        title: "Direct Entrepreneurship",
        type: "study",
        duration: "Variable",
        pros: ["Own business", "Unlimited potential", "Creative freedom", "Flexible schedule"],
        cons: ["High risk", "No guaranteed income", "Long hours", "Financial stress"],
        children: ["startup-careers"]
      },
      "business-careers": {
        title: "Management Career Options",
        type: "paths",
        paths: [
          "Management Consultant (₹12-30L)",
          "Investment Banker (₹15-40L)",
          "Product Manager (₹10-25L)",
          "Marketing Manager (₹8-20L)",
          "Operations Manager (₹8-18L)"
        ]
      },
      "finance-careers": {
        title: "Finance Career Options",
        type: "paths",
        paths: [
          "Chartered Accountant (₹8-25L)",
          "Financial Analyst (₹6-15L)",
          "Tax Consultant (₹7-18L)",
          "Audit Manager (₹10-20L)",
          "Investment Advisor (₹8-20L)"
        ]
      },
      "startup-careers": {
        title: "Entrepreneurship Options",
        type: "paths",
        paths: [
          "Tech Startup (Variable)",
          "E-commerce Business (Variable)",
          "Consulting Firm (Variable)",
          "Franchise Business (Variable)",
          "Service Business (Variable)"
        ]
      }
    },
    Research: {
      start: {
        title: "Class 12 Science/Commerce",
        type: "start",
        children: ["research-path"]
      },
      "research-path": {
        title: "Research Education Pathways",
        type: "decision",
        children: ["science-research", "social-research", "tech-research"]
      },
      "science-research": {
        title: "B.Sc → M.Sc → Ph.D",
        type: "study",
        duration: "3+2+3-5 years",
        pros: ["Deep knowledge", "Academic freedom", "Contribution to science", "Intellectual satisfaction"],
        cons: ["Very long duration", "Low initial pay", "Limited job opportunities", "High competition"],
        children: ["science-careers"]
      },
      "social-research": {
        title: "BA/MA → Ph.D in Social Sciences",
        type: "study",
        duration: "3+2+3-5 years",
        pros: ["Social impact", "Policy influence", "Academic career", "Research freedom"],
        cons: ["Limited funding", "Long duration", "Uncertain career path", "Low pay"],
        children: ["social-careers"]
      },
      "tech-research": {
        title: "B.Tech → M.Tech → Ph.D",
        type: "study",
        duration: "4+2+3-5 years",
        pros: ["High-tech focus", "Industry relevance", "Good funding", "Innovation opportunities"],
        cons: ["Very long duration", "High competition", "Stressful", "Limited positions"],
        children: ["tech-research-careers"]
      },
      "science-careers": {
        title: "Science Research Careers",
        type: "paths",
        paths: [
          "Research Scientist (₹6-15L)",
          "University Professor (₹8-20L)",
          "Lab Manager (₹7-12L)",
          "Scientific Writer (₹4-10L)",
          "Patent Analyst (₹6-12L)"
        ]
      },
      "social-careers": {
        title: "Social Research Careers",
        type: "paths",
        paths: [
          "Policy Researcher (₹5-12L)",
          "Social Worker (₹3-8L)",
          "NGO Manager (₹4-10L)",
          "Academic Researcher (₹6-15L)",
          "Consultant (₹8-18L)"
        ]
      },
      "tech-research-careers": {
        title: "Tech Research Careers",
        type: "paths",
        paths: [
          "R&D Engineer (₹8-20L)",
          "Research Scientist (₹10-25L)",
          "Tech Lead (₹15-35L)",
          "Innovation Manager (₹12-30L)",
          "Patent Engineer (₹8-18L)"
        ]
      }
    },
    Teaching: {
      start: {
        title: "Class 12 Any Stream",
        type: "start",
        children: ["teaching-path"]
      },
      "teaching-path": {
        title: "Teaching Education Pathways",
        type: "decision",
        children: ["school-teaching", "college-teaching", "coaching-teaching"]
      },
      "school-teaching": {
        title: "B.Ed → School Teacher",
        type: "study",
        duration: "3+2 years",
        pros: ["Job security", "Good work-life balance", "Summer vacations", "Social respect"],
        cons: ["Limited salary growth", "Repetitive work", "Limited creativity", "Bureaucracy"],
        children: ["school-careers"]
      },
      "college-teaching": {
        title: "Masters → Ph.D → College Professor",
        type: "study",
        duration: "3+2+3-5 years",
        pros: ["Academic freedom", "Research opportunities", "Good salary", "Intellectual environment"],
        cons: ["Very long education", "High competition", "Publish or perish", "Limited positions"],
        children: ["college-careers"]
      },
      "coaching-teaching": {
        title: "Subject Expertise → Coaching",
        type: "study",
        duration: "Variable",
        pros: ["High earning potential", "Flexible schedule", "Direct impact", "Entrepreneurial"],
        cons: ["Unstable income", "High competition", "Long hours", "Seasonal work"],
        children: ["coaching-careers"]
      },
      "school-careers": {
        title: "School Teaching Careers",
        type: "paths",
        paths: [
          "Primary Teacher (₹3-6L)",
          "Secondary Teacher (₹4-8L)",
          "Principal (₹8-15L)",
          "Vice Principal (₹6-12L)",
          "Subject Coordinator (₹5-10L)"
        ]
      },
      "college-careers": {
        title: "College Teaching Careers",
        type: "paths",
        paths: [
          "Assistant Professor (₹6-12L)",
          "Associate Professor (₹10-18L)",
          "Professor (₹15-25L)",
          "Dean (₹20-35L)",
          "Vice Chancellor (₹25-50L)"
        ]
      },
      "coaching-careers": {
        title: "Coaching Career Options",
        type: "paths",
        paths: [
          "JEE/NEET Coach (₹5-20L)",
          "Competitive Exam Trainer (₹4-15L)",
          "Language Teacher (₹3-10L)",
          "Skill Trainer (₹4-12L)",
          "Online Educator (₹3-15L)"
        ]
      }
    },
    Arts: {
      start: {
        title: "Class 12 Any Stream",
        type: "start",
        children: ["arts-path"]
      },
      "arts-path": {
        title: "Arts & Creative Pathways",
        type: "decision",
        children: ["fine-arts", "performing-arts", "media-arts"]
      },
      "fine-arts": {
        title: "BFA → Fine Arts",
        type: "study",
        duration: "4 years",
        pros: ["Creative expression", "Flexible career", "Portfolio building", "Artistic satisfaction"],
        cons: ["Uncertain income", "Limited job security", "High competition", "Requires talent"],
        children: ["fine-arts-careers"]
      },
      "performing-arts": {
        title: "Drama/Music/Dance Training",
        type: "study",
        duration: "3-4 years",
        pros: ["Creative fulfillment", "Performance opportunities", "Cultural contribution", "Flexible schedule"],
        cons: ["Unstable income", "High competition", "Physical demands", "Limited growth"],
        children: ["performing-careers"]
      },
      "media-arts": {
        title: "Media/Journalism/Film",
        type: "study",
        duration: "3-4 years",
        pros: ["Creative industry", "Media exposure", "Diverse opportunities", "Networking"],
        cons: ["High competition", "Unstable work", "Long hours", "Stressful deadlines"],
        children: ["media-careers"]
      },
      "fine-arts-careers": {
        title: "Fine Arts Career Options",
        type: "paths",
        paths: [
          "Painter/Artist (₹2-10L)",
          "Graphic Designer (₹3-8L)",
          "Art Teacher (₹3-6L)",
          "Gallery Curator (₹4-8L)",
          "Art Director (₹5-12L)"
        ]
      },
      "performing-careers": {
        title: "Performing Arts Careers",
        type: "paths",
        paths: [
          "Actor/Actress (₹2-20L)",
          "Musician (₹3-15L)",
          "Dancer (₹2-8L)",
          "Theater Director (₹4-12L)",
          "Music Teacher (₹3-8L)"
        ]
      },
      "media-careers": {
        title: "Media Career Options",
        type: "paths",
        paths: [
          "Journalist (₹3-10L)",
          "Video Editor (₹4-12L)",
          "Content Creator (₹2-15L)",
          "Film Director (₹5-50L)",
          "Photographer (₹3-10L)"
        ]
      }
    }
  };

  const currentFlow = (flowchartData[selectedInterest as keyof typeof flowchartData] || flowchartData.Engineering) as any;

  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'start': return { backgroundColor: '#f0fdf4', borderColor: '#86efac' };
      case 'decision': return { backgroundColor: '#fefce8', borderColor: '#fde047' };
      case 'action': return { backgroundColor: '#eff6ff', borderColor: '#60a5fa' };
      case 'study': return { backgroundColor: '#faf5ff', borderColor: '#c084fc' };
      case 'paths': return { backgroundColor: '#f9fafb', borderColor: '#d1d5db' };
      default: return { backgroundColor: '#ffffff', borderColor: '#e5e7eb' };
    }
  };

  const renderNode = (nodeId: string, node: any, level: number = 0) => {
    const isExpanded = expandedNodes.includes(nodeId);
    const hasChildren = node.children && node.children.length > 0;
    const nodeStyle = getNodeStyle(node.type);

    return (
      <View key={nodeId} style={[styles.nodeContainer, { marginLeft: level * 16 }]}>
        <Card style={{ ...styles.nodeCard, ...nodeStyle }}>
          <CardContent style={styles.nodeContent}>
            <View style={styles.nodeHeader}>
              <View style={styles.nodeInfo}>
                <Text style={styles.nodeTitle}>{node.title}</Text>
                {node.duration && (
                  <Text style={styles.durationText}>Duration: {node.duration}</Text>
                )}
                {node.pros && (
                  <View style={styles.prosConsContainer}>
                    <View style={styles.prosSection}>
                      <Text style={styles.prosTitle}>✓ Pros:</Text>
                      {node.pros.map((pro: string, index: number) => (
                        <Text key={index} style={styles.prosText}>• {pro}</Text>
                      ))}
                    </View>
                    <View style={styles.consSection}>
                      <Text style={styles.consTitle}>✗ Cons:</Text>
                      {node.cons.map((con: string, index: number) => (
                        <Text key={index} style={styles.consText}>• {con}</Text>
                      ))}
                    </View>
                  </View>
                )}
                {node.paths && (
                  <View style={styles.pathsContainer}>
                    <Text style={styles.pathsTitle}>Career Options:</Text>
                    {node.paths.map((path: string, index: number) => (
                      <View key={index} style={styles.pathItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.pathText}>{path}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              {hasChildren && (
                <TouchableOpacity
                  onPress={() => toggleNode(nodeId)}
                  style={styles.expandButton}
                >
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </CardContent>
        </Card>

        {isExpanded && hasChildren && (
          <View style={styles.childrenContainer}>
            {node.children.map((childId: string) => 
              currentFlow[childId] ? renderNode(childId, currentFlow[childId], level + 1) : null
            )}
          </View>
        )}
      </View>
    );
  };

  // Render the flowchart content (to be used in the Flow tab)
  const renderFlowchart = () => (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f0fdf4' }]} />
            <Text style={styles.legendText}>Start</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#fefce8' }]} />
            <Text style={styles.legendText}>Decision</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#eff6ff' }]} />
            <Text style={styles.legendText}>Action</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#faf5ff' }]} />
            <Text style={styles.legendText}>Study</Text>
          </View>
        </View>
      </View>

      {/* Flowchart */}
      <View style={styles.flowchart}>
        {currentFlow.start && renderNode('start', currentFlow.start)}
      </View>

      <View style={styles.buttonGroup}>
        <GradientButton
          variant="cool"
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
          icon={<Ionicons name="arrow-back" size={18} color="white" />}
        >
          Back
        </GradientButton>
        <GradientButton
          variant="primary"
          onPress={() => navigation.navigate('Eligibility', { formData, interests })}
          style={styles.primaryButton}
          icon={<Ionicons name="school" size={18} color="white" />}
        >
          View Eligible Courses
        </GradientButton>
      </View>
    </ScrollView>
  );
  
  // Render the text outline for accessibility
  const renderTextOutline = () => (
    <FlowchartTextOutline careerCategory={selectedInterest} flowData={currentFlow} />
  );
  
  return (
    <LinearGradient
      colors={['#f1f5f9', '#ffffff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Career Flowchart</Text>
        
        {/* Interest Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestSelector}>
          {(interests.length > 0 ? interests : ['Engineering', 'Medical', 'Business', 'Research', 'Teaching', 'Arts']).map((interest: string) => (
            <TouchableOpacity
              key={interest}
              onPress={() => setSelectedInterest(interest)}
              style={[
                styles.interestButton,
                selectedInterest === interest && styles.interestButtonActive
              ]}
            >
              <Text style={[
                styles.interestButtonText,
                selectedInterest === interest && styles.interestButtonTextActive
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Tab Navigation */}
      <View style={{flex: 1}}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary[700],
            tabBarInactiveTintColor: colors.gray[500],
            tabBarStyle: { backgroundColor: 'transparent' },
            tabBarIndicatorStyle: { backgroundColor: colors.primary[600] },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
          }}
        >
          <Tab.Screen name="Overview">
            {() => <OverviewTab careerCategory={selectedInterest} />}
          </Tab.Screen>
          <Tab.Screen name="Flow">
            {() => (
              <FlowTab 
                careerCategory={selectedInterest} 
                renderFlowchart={renderFlowchart}
                renderTextOutline={renderTextOutline}
                reducedMotion={reducedMotion}
                toggleReducedMotion={toggleReducedMotion}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Colleges">
            {() => <CollegesTab careerCategory={selectedInterest} navigation={navigation} />}
          </Tab.Screen>
          <Tab.Screen name="People">
            {() => <PeopleTab careerCategory={selectedInterest} navigation={navigation} />}
          </Tab.Screen>
          <Tab.Screen name="Outcomes">
            {() => <OutcomesTab careerCategory={selectedInterest} />}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100, // Extra padding for better scrolling
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  interestSelector: {
    marginBottom: 24,
  },
  interestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  interestButtonActive: {
    backgroundColor: '#2563eb',
  },
  interestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  interestButtonTextActive: {
    color: '#ffffff',
  },
  legend: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
  flowchart: {
    marginBottom: 32,
  },
  nodeContainer: {
    marginBottom: 16,
  },
  nodeCard: {
    borderWidth: 2,
  },
  nodeContent: {
    padding: 16,
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nodeInfo: {
    flex: 1,
  },
  nodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  prosConsContainer: {
    marginTop: 8,
    gap: 8,
  },
  prosSection: {
    backgroundColor: '#f0fdf4',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  consSection: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444',
  },
  prosTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  consTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  prosText: {
    fontSize: 12,
    color: '#166534',
    marginBottom: 2,
    lineHeight: 16,
  },
  consText: {
    fontSize: 12,
    color: '#dc2626',
    marginBottom: 2,
    lineHeight: 16,
  },
  pathsContainer: {
    marginTop: 8,
    gap: 4,
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  pathsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  pathItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#6b7280',
    borderRadius: 4,
    marginTop: 6,
  },
  pathText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  expandButton: {
    padding: 8,
  },
  expandIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  childrenContainer: {
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
