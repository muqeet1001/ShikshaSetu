#!/usr/bin/env python3
"""
Data Processor and Alternative Scraping Methods
Handles data processing, export, and alternative data collection methods
"""

import json
import csv
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import random
from typing import Dict, List, Optional, Any
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import os
from datetime import datetime
import sqlite3

logger = logging.getLogger(__name__)

class StudentDataProcessor:
    """Process and export student data in various formats"""
    
    def __init__(self):
        self.data_directory = "data"
        self.ensure_data_directory()
    
    def ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(self.data_directory):
            os.makedirs(self.data_directory)
    
    def export_to_json(self, data: List[Dict], filename: str = None) -> str:
        """Export data to JSON format"""
        if filename is None:
            filename = f"students_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        filepath = os.path.join(self.data_directory, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"Data exported to JSON: {filepath}")
        return filepath
    
    def export_to_csv(self, data: List[Dict], filename: str = None) -> str:
        """Export data to CSV format"""
        if filename is None:
            filename = f"students_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        
        filepath = os.path.join(self.data_directory, filename)
        
        if data:
            df = pd.json_normalize(data)
            df.to_csv(filepath, index=False, encoding='utf-8')
            
            logger.info(f"Data exported to CSV: {filepath}")
        else:
            logger.warning("No data to export")
        
        return filepath
    
    def export_to_excel(self, data: List[Dict], filename: str = None) -> str:
        """Export data to Excel format"""
        if filename is None:
            filename = f"students_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        filepath = os.path.join(self.data_directory, filename)
        
        if data:
            df = pd.json_normalize(data)
            with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
                df.to_sheet('Students', index=False)
            
            logger.info(f"Data exported to Excel: {filepath}")
        else:
            logger.warning("No data to export")
        
        return filepath
    
    def save_to_database(self, data: List[Dict], db_name: str = "students.db"):
        """Save data to SQLite database"""
        db_path = os.path.join(self.data_directory, db_name)
        
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                college TEXT,
                degree TEXT,
                graduation_year TEXT,
                location TEXT,
                headline TEXT,
                profile_url TEXT,
                connections INTEGER,
                skills TEXT,
                experience TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert data
        for student in data:
            cursor.execute('''
                INSERT INTO students (name, college, degree, graduation_year, location, 
                                    headline, profile_url, connections, skills, experience)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                student.get('name'),
                student.get('college'),
                student.get('degree'),
                student.get('graduation_year'),
                student.get('location'),
                student.get('headline'),
                student.get('profile_url'),
                student.get('connections'),
                json.dumps(student.get('skills', [])),
                json.dumps(student.get('experience', []))
            ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Data saved to database: {db_path}")

class AlternativeDataCollector:
    """Alternative methods for collecting student data"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def search_google_for_students(self, college_name: str, additional_terms: str = "") -> List[Dict]:
        """Search Google for student profiles from a specific college"""
        logger.info(f"Searching Google for students from {college_name}")
        
        query = f'"{college_name}" students site:linkedin.com/in {additional_terms}'
        
        # Note: This is a simplified example. In practice, you'd need to handle pagination,
        # respect robots.txt, and potentially use Google's Custom Search API
        
        try:
            # Mock implementation - replace with actual search logic
            search_results = self._mock_google_search_results(college_name)
            return search_results
            
        except Exception as e:
            logger.error(f"Error searching Google: {e}")
            return []
    
    def _mock_google_search_results(self, college_name: str) -> List[Dict]:
        """Generate mock Google search results"""
        results = []
        
        for i in range(5):
            result = {
                'name': f'Student from {college_name} {i+1}',
                'college': college_name,
                'profile_url': f'https://linkedin.com/in/student-{i+1}',
                'snippet': f'Student at {college_name}, pursuing Engineering degree',
                'source': 'Google Search'
            }
            results.append(result)
        
        return results
    
    def scrape_college_website(self, college_url: str) -> List[Dict]:
        """Scrape college website for student information"""
        logger.info(f"Scraping college website: {college_url}")
        
        try:
            response = self.session.get(college_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # This would need to be customized based on each college's website structure
            students = self._extract_students_from_college_page(soup, college_url)
            
            return students
            
        except Exception as e:
            logger.error(f"Error scraping college website: {e}")
            return []
    
    def _extract_students_from_college_page(self, soup: BeautifulSoup, college_url: str) -> List[Dict]:
        """Extract student information from college webpage"""
        # Mock implementation - would need to be customized per college
        return [
            {
                'name': 'Student from College Website',
                'college': 'College from Website',
                'source': 'College Website',
                'profile_url': college_url
            }
        ]

class SeleniumLinkedInScraper:
    """Selenium-based LinkedIn scraper (use with caution)"""
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.driver = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome WebDriver with options"""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument('--headless')
        
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        except Exception as e:
            logger.error(f"Error setting up Chrome driver: {e}")
            logger.info("Please ensure ChromeDriver is installed and in PATH")
    
    def login_to_linkedin(self, email: str, password: str) -> bool:
        """Login to LinkedIn (use with caution - may violate ToS)"""
        if not self.driver:
            return False
        
        try:
            self.driver.get('https://www.linkedin.com/login')
            
            # Wait for login form
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "username"))
            )
            password_field = self.driver.find_element(By.ID, "password")
            
            email_field.send_keys(email)
            password_field.send_keys(password)
            
            # Click login button
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            
            # Wait for successful login
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "global-nav"))
            )
            
            logger.info("Successfully logged into LinkedIn")
            return True
            
        except TimeoutException:
            logger.error("Login timeout - check credentials or CAPTCHA")
            return False
        except Exception as e:
            logger.error(f"Login error: {e}")
            return False
    
    def search_linkedin_students(self, college_name: str, limit: int = 10) -> List[Dict]:
        """Search for students on LinkedIn using Selenium"""
        if not self.driver:
            return []
        
        try:
            # Construct search URL
            search_query = f"people students {college_name}"
            search_url = f"https://www.linkedin.com/search/results/people/?keywords={search_query}"
            
            self.driver.get(search_url)
            
            # Wait for results to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "search-results-container"))
            )
            
            students = []
            results = self.driver.find_elements(By.CSS_SELECTOR, ".entity-result__item")
            
            for i, result in enumerate(results[:limit]):
                try:
                    student_data = self._extract_student_from_result(result, college_name)
                    if student_data:
                        students.append(student_data)
                    
                    # Add random delay to avoid detection
                    time.sleep(random.uniform(1, 3))
                    
                except Exception as e:
                    logger.warning(f"Error extracting student {i}: {e}")
                    continue
            
            return students
            
        except Exception as e:
            logger.error(f"Error searching LinkedIn: {e}")
            return []
    
    def _extract_student_from_result(self, result_element, college_name: str) -> Optional[Dict]:
        """Extract student data from search result element"""
        try:
            # Extract name
            name_element = result_element.find_element(By.CSS_SELECTOR, ".entity-result__title-text a")
            name = name_element.get_attribute("aria-label") or name_element.text
            profile_url = name_element.get_attribute("href")
            
            # Extract headline
            headline_element = result_element.find_element(By.CSS_SELECTOR, ".entity-result__primary-subtitle")
            headline = headline_element.text if headline_element else ""
            
            # Extract location
            location_element = result_element.find_element(By.CSS_SELECTOR, ".entity-result__secondary-subtitle")
            location = location_element.text if location_element else ""
            
            return {
                'name': name.strip(),
                'college': college_name,
                'headline': headline.strip(),
                'location': location.strip(),
                'profile_url': profile_url,
                'source': 'LinkedIn Selenium'
            }
            
        except NoSuchElementException:
            return None
    
    def close(self):
        """Close the WebDriver"""
        if self.driver:
            self.driver.quit()
            self.driver = None

class DataAggregator:
    """Aggregate data from multiple sources"""
    
    def __init__(self):
        self.processor = StudentDataProcessor()
        self.google_collector = AlternativeDataCollector()
    
    def collect_comprehensive_data(self, college_name: str, methods: List[str] = None) -> List[Dict]:
        """Collect student data using multiple methods"""
        if methods is None:
            methods = ['mock', 'google_search']  # Safe methods by default
        
        all_data = []
        
        for method in methods:
            logger.info(f"Using method: {method}")
            
            if method == 'mock':
                data = self._generate_mock_data(college_name, 5)
                all_data.extend(data)
            
            elif method == 'google_search':
                data = self.google_collector.search_google_for_students(college_name)
                all_data.extend(data)
            
            # Add delay between methods
            time.sleep(2)
        
        # Remove duplicates based on profile URL or name
        unique_data = self._remove_duplicates(all_data)
        
        return unique_data
    
    def _generate_mock_data(self, college_name: str, count: int) -> List[Dict]:
        """Generate comprehensive mock data"""
        departments = [
            'Computer Science Engineering',
            'Mechanical Engineering', 
            'Electronics and Communication Engineering',
            'Civil Engineering',
            'Information Technology',
            'Electrical Engineering'
        ]
        
        locations = [
            'Bangalore, Karnataka, India',
            'Mumbai, Maharashtra, India',
            'Delhi, India',
            'Chennai, Tamil Nadu, India',
            'Pune, Maharashtra, India',
            'Hyderabad, Telangana, India'
        ]
        
        skills_by_dept = {
            'Computer Science Engineering': ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'MySQL', 'Git'],
            'Mechanical Engineering': ['AutoCAD', 'SolidWorks', 'CATIA', 'Manufacturing', 'Design', 'Analysis'],
            'Electronics and Communication Engineering': ['Circuit Design', 'VLSI', 'Embedded Systems', 'MATLAB', 'PCB Design'],
            'Civil Engineering': ['AutoCAD', 'Structural Analysis', 'Project Management', 'Construction', 'Surveying'],
            'Information Technology': ['Programming', 'Database Management', 'Web Development', 'Cloud Computing'],
            'Electrical Engineering': ['Power Systems', 'Control Systems', 'Electronics', 'MATLAB', 'PLC']
        }
        
        mock_data = []
        
        for i in range(count):
            dept = random.choice(departments)
            
            student = {
                'name': f'Student {i+1} {college_name.split()[0]}',
                'college': college_name,
                'degree': dept,
                'graduation_year': str(random.choice([2023, 2024, 2025])),
                'location': random.choice(locations),
                'headline': f'{dept} Student at {college_name} | Aspiring Engineer',
                'profile_url': f'https://linkedin.com/in/student-{college_name.lower().replace(" ", "-")}-{i+1}',
                'connections': random.randint(50, 500),
                'skills': random.sample(skills_by_dept.get(dept, ['Engineering']), 
                                      min(len(skills_by_dept.get(dept, ['Engineering'])), random.randint(3, 6))),
                'experience': [
                    {
                        'title': random.choice(['Intern', 'Trainee', 'Project Assistant']),
                        'company': f'Company {i+1}',
                        'duration': random.choice(['2 months', '3 months', '6 months']),
                        'description': f'Worked on {dept.lower()} projects'
                    }
                ],
                'source': 'Mock Data'
            }
            
            mock_data.append(student)
        
        return mock_data
    
    def _remove_duplicates(self, data: List[Dict]) -> List[Dict]:
        """Remove duplicate entries based on profile URL or name"""
        seen = set()
        unique_data = []
        
        for item in data:
            identifier = item.get('profile_url') or item.get('name', '')
            
            if identifier and identifier not in seen:
                seen.add(identifier)
                unique_data.append(item)
        
        return unique_data

# Example usage function
def main():
    """Demonstrate the data collection and processing capabilities"""
    logger.info("Starting comprehensive student data collection")
    
    # Initialize components
    aggregator = DataAggregator()
    processor = StudentDataProcessor()
    
    # Target college
    college_name = "HKB College of Engineering"
    
    # Collect data using multiple methods
    student_data = aggregator.collect_comprehensive_data(
        college_name, 
        methods=['mock', 'google_search']
    )
    
    logger.info(f"Collected {len(student_data)} student records")
    
    # Export in multiple formats
    json_file = processor.export_to_json(student_data)
    csv_file = processor.export_to_csv(student_data)
    excel_file = processor.export_to_excel(student_data)
    
    # Save to database
    processor.save_to_database(student_data)
    
    logger.info("Data collection and export completed successfully!")
    
    return student_data

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    main()