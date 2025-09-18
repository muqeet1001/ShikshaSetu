#!/usr/bin/env python3
"""
Live LinkedIn Student Data Fetcher
Combines Hunter.io and Scraping APIs to fetch real LinkedIn student data
"""

import json
import time
import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import re

from hunter_api_client import HunterAPIClient, get_college_domains
from scrape_api_client import ScrapeAPIClient

logger = logging.getLogger(__name__)

class LiveLinkedInFetcher:
    """Main class for fetching real LinkedIn student data using multiple APIs"""
    
    def __init__(self, hunter_api_key: str = None, scrape_api_key: str = None, scrape_service: str = 'scrapingbee'):
        """
        Initialize the live fetcher with API credentials
        
        Args:
            hunter_api_key: Hunter.io API key
            scrape_api_key: Scraping service API key
            scrape_service: Scraping service to use ('scrapingbee', 'scrapeowl', 'scrapfly')
        """
        self.hunter_client = HunterAPIClient(hunter_api_key)
        self.scrape_client = ScrapeAPIClient(scrape_api_key, scrape_service)
        
        # Create results directory
        self.results_dir = "live_results"
        os.makedirs(self.results_dir, exist_ok=True)
        
        # API usage tracking
        self.api_usage = {
            'hunter_requests': 0,
            'scrape_requests': 0,
            'successful_profiles': 0,
            'failed_profiles': 0
        }
    
    def fetch_college_students(self, college_name: str, limit: int = 50, methods: List[str] = None) -> List[Dict[str, Any]]:
        """
        Fetch real student data for a specific college
        
        Args:
            college_name: Name of the college (e.g., "HKB College of Engineering")
            limit: Maximum number of students to fetch
            methods: List of methods to use ['hunter', 'search', 'both']
            
        Returns:
            List of student profile dictionaries
        """
        if methods is None:
            methods = ['both']  # Use both Hunter and search by default
        
        logger.info(f"Starting live data fetch for: {college_name}")
        logger.info(f"Target: {limit} students, Methods: {methods}")
        
        all_students = []
        
        # Method 1: Use Hunter.io to find emails and LinkedIn profiles
        if 'hunter' in methods or 'both' in methods:
            logger.info("Phase 1: Using Hunter.io to find student emails...")
            hunter_profiles = self._fetch_via_hunter(college_name, limit // 2)
            all_students.extend(hunter_profiles)
            logger.info(f"Hunter.io found: {len(hunter_profiles)} potential students")
        
        # Method 2: Use Google search via Scrape API to find LinkedIn profiles
        if 'search' in methods or 'both' in methods:
            logger.info("Phase 2: Using Google search to find LinkedIn profiles...")
            search_profiles = self._fetch_via_search(college_name, limit // 2)
            all_students.extend(search_profiles)
            logger.info(f"Google search found: {len(search_profiles)} LinkedIn profiles")
        
        # Remove duplicates based on LinkedIn URL or email
        unique_students = self._remove_duplicates(all_students)
        logger.info(f"After deduplication: {len(unique_students)} unique students")
        
        # Limit results to requested number
        final_students = unique_students[:limit]
        
        # Save results
        self._save_results(college_name, final_students)
        
        # Log API usage
        logger.info(f"API Usage - Hunter: {self.api_usage['hunter_requests']}, "
                   f"Scraper: {self.api_usage['scrape_requests']}, "
                   f"Success: {self.api_usage['successful_profiles']}, "
                   f"Failed: {self.api_usage['failed_profiles']}")
        
        return final_students
    
    def _fetch_via_hunter(self, college_name: str, limit: int) -> List[Dict[str, Any]]:
        """Fetch student data using Hunter.io API"""
        profiles = []
        
        try:
            # Get college domains
            domains = get_college_domains(college_name)
            logger.info(f"Searching Hunter.io for domains: {domains}")
            
            for domain in domains:
                logger.info(f"Searching Hunter.io for domain: {domain}")
                
                # Find emails for this domain
                email_data = self.hunter_client.find_emails_by_domain(domain, limit=limit)
                self.api_usage['hunter_requests'] += 1
                
                if email_data:
                    # Extract profiles with potential LinkedIn data
                    domain_profiles = self.hunter_client.extract_linkedin_profiles(email_data)
                    
                    # Enhance profiles with college information
                    for profile in domain_profiles:
                        profile['college'] = college_name
                        profile['domain'] = domain
                        profile['method'] = 'Hunter.io'
                        
                        # If we have a LinkedIn URL, scrape detailed information
                        if profile.get('linkedin_url'):
                            logger.info(f"Scraping detailed profile for: {profile['first_name']} {profile['last_name']}")
                            detailed_data = self.scrape_client.scrape_linkedin_profile(profile['linkedin_url'])
                            self.api_usage['scrape_requests'] += 1
                            
                            if detailed_data:
                                profile.update(detailed_data)
                                profile['data_quality'] = 'high'
                                self.api_usage['successful_profiles'] += 1
                            else:
                                profile['data_quality'] = 'medium'
                                self.api_usage['failed_profiles'] += 1
                            
                            # Rate limiting
                            time.sleep(2)
                        else:
                            profile['data_quality'] = 'low'
                    
                    profiles.extend(domain_profiles)
                
                # Rate limiting between domains
                if len(domains) > 1:
                    time.sleep(1)
                
                if len(profiles) >= limit:
                    break
            
            logger.info(f"Hunter.io method completed: {len(profiles)} profiles")
            return profiles
            
        except Exception as e:
            logger.error(f"Error in Hunter.io fetch: {e}")
            return []
    
    def _fetch_via_search(self, college_name: str, limit: int) -> List[Dict[str, Any]]:
        """Fetch student data using Google search via Scrape API"""
        profiles = []
        
        try:
            # Search for LinkedIn profiles
            search_queries = [
                f"{college_name} students",
                f"{college_name} alumni",
                f"students {college_name} engineering",
                f"{college_name} graduates"
            ]
            
            linkedin_urls = []
            
            for query in search_queries:
                logger.info(f"Searching Google for: {query}")
                urls = self.scrape_client.search_linkedin_profiles(query, limit=limit//len(search_queries))
                self.api_usage['scrape_requests'] += 1
                
                linkedin_urls.extend(urls)
                
                # Rate limiting
                time.sleep(2)
                
                if len(linkedin_urls) >= limit:
                    break
            
            # Remove duplicates from URLs
            unique_urls = list(set(linkedin_urls))[:limit]
            logger.info(f"Found {len(unique_urls)} unique LinkedIn URLs to scrape")
            
            # Scrape each profile
            for i, url in enumerate(unique_urls):
                logger.info(f"Scraping profile {i+1}/{len(unique_urls)}: {url}")
                
                profile_data = self.scrape_client.scrape_linkedin_profile(url)
                self.api_usage['scrape_requests'] += 1
                
                if profile_data:
                    # Enhance with college information
                    profile_data['college'] = college_name
                    profile_data['method'] = 'Google Search + Scraping'
                    profile_data['data_quality'] = 'high'
                    
                    # Try to extract graduation year and degree info
                    profile_data = self._enhance_student_data(profile_data, college_name)
                    
                    profiles.append(profile_data)
                    self.api_usage['successful_profiles'] += 1
                else:
                    self.api_usage['failed_profiles'] += 1
                
                # Rate limiting (important for scraping)
                time.sleep(3)
            
            logger.info(f"Google search method completed: {len(profiles)} profiles")
            return profiles
            
        except Exception as e:
            logger.error(f"Error in Google search fetch: {e}")
            return []
    
    def _enhance_student_data(self, profile_data: Dict[str, Any], college_name: str) -> Dict[str, Any]:
        """Enhance profile data with student-specific information"""
        try:
            # Try to extract graduation year from education data
            graduation_years = []
            relevant_education = []
            
            for edu in profile_data.get('education', []):
                school_name = edu.get('school', '').lower()
                college_name_lower = college_name.lower()
                
                # Check if this education entry is from the target college
                college_keywords = college_name_lower.split()
                if any(keyword in school_name for keyword in college_keywords if len(keyword) > 2):
                    relevant_education.append(edu)
                    
                    # Extract graduation year
                    dates = edu.get('dates', '')
                    if dates:
                        year_matches = re.findall(r'20\d{2}', dates)
                        if year_matches:
                            graduation_years.extend(year_matches)
            
            # Set graduation year
            if graduation_years:
                profile_data['graduation_year'] = max(graduation_years)  # Use most recent year
            
            # Set relevant education
            if relevant_education:
                profile_data['college_education'] = relevant_education
                
                # Try to extract degree
                for edu in relevant_education:
                    degree = edu.get('degree', '') or edu.get('field_of_study', '')
                    if degree:
                        profile_data['degree'] = degree
                        break
            
            # Classify as student vs alumni based on timeline
            current_year = datetime.now().year
            graduation_year = profile_data.get('graduation_year')
            
            if graduation_year:
                try:
                    grad_year_int = int(graduation_year)
                    if grad_year_int >= current_year:
                        profile_data['student_status'] = 'current_student'
                    elif grad_year_int >= current_year - 2:
                        profile_data['student_status'] = 'recent_graduate'
                    else:
                        profile_data['student_status'] = 'alumni'
                except ValueError:
                    profile_data['student_status'] = 'unknown'
            else:
                profile_data['student_status'] = 'unknown'
            
            return profile_data
            
        except Exception as e:
            logger.error(f"Error enhancing student data: {e}")
            return profile_data
    
    def _remove_duplicates(self, profiles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate profiles based on LinkedIn URL, email, or name"""
        seen = set()
        unique_profiles = []
        
        for profile in profiles:
            # Create identifier from available data
            identifiers = []
            
            if profile.get('linkedin_url'):
                identifiers.append(profile['linkedin_url'].lower())
            
            if profile.get('email'):
                identifiers.append(profile['email'].lower())
            
            if profile.get('name'):
                identifiers.append(profile['name'].lower().replace(' ', ''))
            elif profile.get('first_name') and profile.get('last_name'):
                name = f"{profile['first_name']} {profile['last_name']}".lower().replace(' ', '')
                identifiers.append(name)
            
            # Check if we've seen any of these identifiers
            is_duplicate = any(identifier in seen for identifier in identifiers)
            
            if not is_duplicate and identifiers:
                # Add all identifiers to seen set
                for identifier in identifiers:
                    seen.add(identifier)
                unique_profiles.append(profile)
        
        logger.info(f"Removed {len(profiles) - len(unique_profiles)} duplicates")
        return unique_profiles
    
    def _save_results(self, college_name: str, students: List[Dict[str, Any]]):
        """Save results to files"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_filename = college_name.lower().replace(' ', '_').replace('&', 'and')
        
        # Save detailed JSON
        json_filename = f"{self.results_dir}/{base_filename}_live_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(students, f, indent=2, ensure_ascii=False, default=str)
        
        logger.info(f"Detailed results saved to: {json_filename}")
        
        # Save summary CSV
        csv_filename = f"{self.results_dir}/{base_filename}_summary_{timestamp}.csv"
        self._save_csv_summary(students, csv_filename)
        
        logger.info(f"Summary CSV saved to: {csv_filename}")
        
        # Save API usage report
        report_filename = f"{self.results_dir}/{base_filename}_report_{timestamp}.txt"
        self._save_usage_report(college_name, students, report_filename)
        
        logger.info(f"Usage report saved to: {report_filename}")
    
    def _save_csv_summary(self, students: List[Dict[str, Any]], filename: str):
        """Save a CSV summary of the student data"""
        try:
            import csv
            
            with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = [
                    'name', 'college', 'degree', 'graduation_year', 'location', 
                    'headline', 'linkedin_url', 'email', 'student_status', 
                    'method', 'data_quality'
                ]
                
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                
                for student in students:
                    row = {}
                    for field in fieldnames:
                        value = student.get(field, '')
                        # Handle complex fields
                        if isinstance(value, list):
                            value = ', '.join(str(v) for v in value)
                        row[field] = value
                    writer.writerow(row)
                    
        except Exception as e:
            logger.error(f"Error saving CSV: {e}")
    
    def _save_usage_report(self, college_name: str, students: List[Dict[str, Any]], filename: str):
        """Save an API usage and results report"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(f"Live LinkedIn Student Data Fetch Report\n")
                f.write(f"======================================\n\n")
                f.write(f"College: {college_name}\n")
                f.write(f"Timestamp: {datetime.now()}\n")
                f.write(f"Total Students Found: {len(students)}\n\n")
                
                f.write(f"API Usage:\n")
                f.write(f"- Hunter.io Requests: {self.api_usage['hunter_requests']}\n")
                f.write(f"- Scraping Requests: {self.api_usage['scrape_requests']}\n")
                f.write(f"- Successful Profiles: {self.api_usage['successful_profiles']}\n")
                f.write(f"- Failed Profiles: {self.api_usage['failed_profiles']}\n\n")
                
                # Data quality breakdown
                quality_counts = {}
                method_counts = {}
                status_counts = {}
                
                for student in students:
                    quality = student.get('data_quality', 'unknown')
                    method = student.get('method', 'unknown')
                    status = student.get('student_status', 'unknown')
                    
                    quality_counts[quality] = quality_counts.get(quality, 0) + 1
                    method_counts[method] = method_counts.get(method, 0) + 1
                    status_counts[status] = status_counts.get(status, 0) + 1
                
                f.write(f"Data Quality Breakdown:\n")
                for quality, count in quality_counts.items():
                    f.write(f"- {quality}: {count} students\n")
                
                f.write(f"\nData Source Breakdown:\n")
                for method, count in method_counts.items():
                    f.write(f"- {method}: {count} students\n")
                
                f.write(f"\nStudent Status Breakdown:\n")
                for status, count in status_counts.items():
                    f.write(f"- {status}: {count} students\n")
                
                f.write(f"\nSample Student Data:\n")
                for i, student in enumerate(students[:5], 1):
                    f.write(f"\n{i}. {student.get('name', 'N/A')}\n")
                    f.write(f"   College: {student.get('college', 'N/A')}\n")
                    f.write(f"   Degree: {student.get('degree', 'N/A')}\n")
                    f.write(f"   Year: {student.get('graduation_year', 'N/A')}\n")
                    f.write(f"   Status: {student.get('student_status', 'N/A')}\n")
                    f.write(f"   Method: {student.get('method', 'N/A')}\n")
                    f.write(f"   Quality: {student.get('data_quality', 'N/A')}\n")
                    
        except Exception as e:
            logger.error(f"Error saving usage report: {e}")

def main():
    """Test the live LinkedIn fetcher"""
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Initialize fetcher (you'll need API keys)
    fetcher = LiveLinkedInFetcher()
    
    # Test college
    college_name = "HKB College of Engineering"
    
    print(f"🚀 Starting live LinkedIn data fetch for: {college_name}")
    print("⚠️  Note: This requires API keys for Hunter.io and a scraping service")
    print("📝 Set environment variables: HUNTER_API_KEY and SCRAPE_API_KEY")
    print()
    
    # Fetch student data
    students = fetcher.fetch_college_students(college_name, limit=10, methods=['both'])
    
    if students:
        print(f"✅ Successfully fetched {len(students)} student profiles!")
        
        # Display sample results
        for i, student in enumerate(students[:3], 1):
            print(f"\n{i}. {student.get('name', 'N/A')}")
            print(f"   College: {student.get('college', 'N/A')}")
            print(f"   Degree: {student.get('degree', 'N/A')}")
            print(f"   Status: {student.get('student_status', 'N/A')}")
            print(f"   LinkedIn: {student.get('linkedin_url', 'N/A')}")
            print(f"   Data Source: {student.get('method', 'N/A')}")
            print(f"   Quality: {student.get('data_quality', 'N/A')}")
        
        if len(students) > 3:
            print(f"   ... and {len(students) - 3} more students")
        
        print(f"\n📁 Results saved in: live_results/ directory")
    else:
        print("❌ No student data found. Check your API keys and try again.")
    
    print("\n🎉 Live fetch completed!")

if __name__ == "__main__":
    main()