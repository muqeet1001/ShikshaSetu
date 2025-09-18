#!/usr/bin/env python3
"""
LinkedIn Student Data Fetcher
A tool to fetch college student details from LinkedIn using official APIs
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import logging
from urllib.parse import quote_plus

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class StudentProfile:
    """Data class for student profile information"""
    name: str
    college: str
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    profile_url: Optional[str] = None
    connections: Optional[int] = None
    skills: List[str] = None
    experience: List[Dict] = None

class LinkedInStudentFetcher:
    """Main class for fetching LinkedIn student data"""
    
    def __init__(self, access_token: str = None):
        """Initialize with LinkedIn API access token"""
        self.access_token = access_token or os.getenv('LINKEDIN_ACCESS_TOKEN')
        self.base_url = "https://api.linkedin.com/v2"
        self.headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }
        
        if not self.access_token:
            logger.warning("No LinkedIn access token provided. Some features may not work.")
    
    def search_students_by_college(self, college_name: str, limit: int = 50) -> List[StudentProfile]:
        """
        Search for students from a specific college
        
        Args:
            college_name: Name of the college (e.g., "HKB College of Engineering")
            limit: Maximum number of results to return
            
        Returns:
            List of StudentProfile objects
        """
        logger.info(f"Searching for students from {college_name}")
        
        # Since direct LinkedIn API access is limited, we'll use a mock implementation
        # In real scenarios, you'd need LinkedIn's People Search API with proper permissions
        
        students = []
        
        # Mock data for demonstration - replace with actual API calls
        mock_students = self._generate_mock_data(college_name, limit)
        
        for student_data in mock_students:
            student = StudentProfile(
                name=student_data.get('name', ''),
                college=college_name,
                degree=student_data.get('degree'),
                graduation_year=student_data.get('graduationYear'),
                location=student_data.get('location'),
                headline=student_data.get('headline'),
                profile_url=student_data.get('profileUrl'),
                connections=student_data.get('connections'),
                skills=student_data.get('skills', []),
                experience=student_data.get('experience', [])
            )
            students.append(student)
        
        logger.info(f"Found {len(students)} students from {college_name}")
        return students
    
    def _generate_mock_data(self, college_name: str, limit: int) -> List[Dict]:
        """Generate mock student data for demonstration"""
        mock_data = []
        
        for i in range(min(limit, 10)):  # Limit to 10 for demo
            student = {
                'name': f'Student {i+1}',
                'degree': ['Computer Science', 'Mechanical Engineering', 'Electronics', 'Civil Engineering'][i % 4],
                'graduationYear': str(2023 + (i % 3)),
                'location': ['Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Chennai, India'][i % 4],
                'headline': f'Student at {college_name} | Aspiring Engineer',
                'profileUrl': f'https://linkedin.com/in/student{i+1}',
                'connections': 100 + (i * 25),
                'skills': [
                    ['Python', 'Java', 'Data Science'],
                    ['AutoCAD', 'SolidWorks', 'Manufacturing'],
                    ['Circuit Design', 'Embedded Systems', 'IoT'],
                    ['Structural Analysis', 'Project Management', 'Construction']
                ][i % 4],
                'experience': [
                    {
                        'title': 'Intern',
                        'company': f'Tech Company {i+1}',
                        'duration': '3 months'
                    }
                ]
            }
            mock_data.append(student)
        
        return mock_data
    
    def get_student_details(self, profile_url: str) -> Optional[StudentProfile]:
        """
        Get detailed information for a specific student profile
        
        Args:
            profile_url: LinkedIn profile URL
            
        Returns:
            StudentProfile object or None if not found
        """
        logger.info(f"Fetching details for profile: {profile_url}")
        
        # In a real implementation, this would make API calls to LinkedIn
        # For now, return mock data
        
        return StudentProfile(
            name="Sample Student",
            college="HKB College of Engineering",
            degree="Computer Science Engineering",
            graduation_year="2024",
            location="Bangalore, India",
            headline="CSE Student | Python Developer | Tech Enthusiast",
            profile_url=profile_url,
            connections=150,
            skills=["Python", "Java", "React", "Node.js", "MySQL"],
            experience=[
                {
                    "title": "Software Development Intern",
                    "company": "Tech Solutions Pvt Ltd",
                    "duration": "Jun 2023 - Aug 2023",
                    "description": "Worked on web development projects using React and Node.js"
                }
            ]
        )
    
    def export_to_json(self, students: List[StudentProfile], filename: str = "students_data.json"):
        """
        Export student data to JSON file
        
        Args:
            students: List of StudentProfile objects
            filename: Output filename
        """
        logger.info(f"Exporting {len(students)} student records to {filename}")
        
        # Convert StudentProfile objects to dictionaries
        students_data = []
        for student in students:
            student_dict = {
                'name': student.name,
                'college': student.college,
                'degree': student.degree,
                'graduation_year': student.graduation_year,
                'location': student.location,
                'headline': student.headline,
                'profile_url': student.profile_url,
                'connections': student.connections,
                'skills': student.skills,
                'experience': student.experience
            }
            students_data.append(student_dict)
        
        # Save to JSON file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(students_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Data exported successfully to {filename}")
    
    def search_multiple_colleges(self, college_names: List[str], limit_per_college: int = 20) -> Dict[str, List[StudentProfile]]:
        """
        Search for students from multiple colleges
        
        Args:
            college_names: List of college names
            limit_per_college: Maximum students per college
            
        Returns:
            Dictionary mapping college names to student lists
        """
        results = {}
        
        for college in college_names:
            logger.info(f"Processing college: {college}")
            students = self.search_students_by_college(college, limit_per_college)
            results[college] = students
            
            # Add delay to avoid rate limiting
            time.sleep(1)
        
        return results

def main():
    """Main function to demonstrate usage"""
    logger.info("Starting LinkedIn Student Data Fetcher")
    
    # Initialize the fetcher
    fetcher = LinkedInStudentFetcher()
    
    # Example: Search for students from HKB College of Engineering
    college_name = "HKB College of Engineering"
    students = fetcher.search_students_by_college(college_name, limit=10)
    
    # Export to JSON
    fetcher.export_to_json(students, f"{college_name.replace(' ', '_').lower()}_students.json")
    
    # Example: Search multiple colleges
    colleges = [
        "HKB College of Engineering",
        "RV College of Engineering",
        "BMS College of Engineering"
    ]
    
    all_results = fetcher.search_multiple_colleges(colleges, limit_per_college=5)
    
    # Export combined results
    all_students = []
    for college, student_list in all_results.items():
        all_students.extend(student_list)
    
    fetcher.export_to_json(all_students, "all_colleges_students.json")
    
    logger.info("Process completed successfully!")

if __name__ == "__main__":
    main()