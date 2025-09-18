#!/usr/bin/env python3
"""
Hunter.io API Client
Find student email addresses and LinkedIn profiles from colleges using Hunter.io
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional, Any
import logging
from urllib.parse import quote_plus

logger = logging.getLogger(__name__)

class HunterAPIClient:
    """Hunter.io API client for finding email addresses and LinkedIn profiles"""
    
    def __init__(self, api_key: str = None):
        """
        Initialize Hunter API client
        
        Args:
            api_key: Hunter.io API key (get from https://hunter.io/api-keys)
        """
        self.api_key = api_key or os.getenv('HUNTER_API_KEY')
        self.base_url = "https://api.hunter.io/v2"
        
        if not self.api_key:
            logger.warning("No Hunter API key provided. Please get one from https://hunter.io/api-keys")
    
    def find_emails_by_domain(self, domain: str, limit: int = 100) -> Dict[str, Any]:
        """
        Find email addresses for a specific domain (college)
        
        Args:
            domain: College domain (e.g., 'hkbk.edu.in')
            limit: Maximum number of emails to retrieve
            
        Returns:
            Dictionary containing email data
        """
        if not self.api_key:
            logger.error("Hunter API key is required")
            return {}
        
        url = f"{self.base_url}/domain-search"
        params = {
            'domain': domain,
            'api_key': self.api_key,
            'limit': limit,
            'email_type': 'generic'
        }
        
        try:
            logger.info(f"Searching emails for domain: {domain}")
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('data', {}).get('emails'):
                logger.info(f"Found {len(data['data']['emails'])} emails for {domain}")
                return data
            else:
                logger.warning(f"No emails found for domain: {domain}")
                return {}
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error searching Hunter API: {e}")
            return {}
    
    def find_person_email(self, domain: str, first_name: str, last_name: str) -> Optional[Dict[str, Any]]:
        """
        Find email for a specific person
        
        Args:
            domain: College domain
            first_name: Person's first name
            last_name: Person's last name
            
        Returns:
            Email information if found
        """
        if not self.api_key:
            return None
        
        url = f"{self.base_url}/email-finder"
        params = {
            'domain': domain,
            'first_name': first_name,
            'last_name': last_name,
            'api_key': self.api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('data', {}).get('email'):
                return data['data']
            else:
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error finding person email: {e}")
            return None
    
    def verify_email(self, email: str) -> Dict[str, Any]:
        """
        Verify if an email address is valid and deliverable
        
        Args:
            email: Email address to verify
            
        Returns:
            Verification results
        """
        if not self.api_key:
            return {}
        
        url = f"{self.base_url}/email-verifier"
        params = {
            'email': email,
            'api_key': self.api_key
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error verifying email: {e}")
            return {}
    
    def extract_linkedin_profiles(self, email_data: Dict) -> List[Dict[str, Any]]:
        """
        Extract LinkedIn profiles from Hunter email data
        
        Args:
            email_data: Data from Hunter API
            
        Returns:
            List of profiles with LinkedIn URLs
        """
        profiles = []
        
        emails = email_data.get('data', {}).get('emails', [])
        
        for email_info in emails:
            # Check if this person has social media profiles
            sources = email_info.get('sources', [])
            linkedin_url = None
            
            # Look for LinkedIn in sources
            for source in sources:
                if 'linkedin.com' in source.get('uri', '').lower():
                    linkedin_url = source.get('uri')
                    break
            
            # Also check if LinkedIn is mentioned in the email info
            if not linkedin_url and email_info.get('linkedin_url'):
                linkedin_url = email_info.get('linkedin_url')
            
            if email_info.get('first_name') or email_info.get('last_name'):
                profile = {
                    'first_name': email_info.get('first_name', ''),
                    'last_name': email_info.get('last_name', ''),
                    'email': email_info.get('value', ''),
                    'position': email_info.get('position', ''),
                    'department': email_info.get('department', ''),
                    'linkedin_url': linkedin_url,
                    'confidence': email_info.get('confidence', 0),
                    'verification_status': email_info.get('verification', {}).get('result', 'unknown'),
                    'source': 'Hunter.io'
                }
                profiles.append(profile)
        
        logger.info(f"Extracted {len(profiles)} profiles with potential LinkedIn data")
        return profiles

# College domain mapping - you'll need to research actual domains for each college
COLLEGE_DOMAINS = {
    'HKB College of Engineering': ['hkbk.edu.in', 'hkbkce.ac.in'],
    'RV College of Engineering': ['rvce.edu.in'],
    'BMS College of Engineering': ['bmsce.ac.in'],
    'VTU': ['vtu.ac.in'],
    'Anna University': ['annauniv.edu'],
    'IIT Bangalore': ['iisc.ac.in'],
    'NIT Karnataka': ['nitk.edu.in'],
    'Manipal Institute of Technology': ['manipal.edu'],
    'PES University': ['pes.edu'],
    'Dayananda Sagar College of Engineering': ['dayanandasagar.edu'],
    'Sir M Visvesvaraya Institute of Technology': ['sirmvit.edu'],
    'Bangalore Institute of Technology': ['bit-bangalore.edu.in'],
    'MS Ramaiah Institute of Technology': ['msrit.edu'],
    'New Horizon College of Engineering': ['newhorizonindia.edu'],
    'REVA University': ['reva.edu.in'],
}

def get_college_domains(college_name: str) -> List[str]:
    """
    Get email domains for a college
    
    Args:
        college_name: Name of the college
        
    Returns:
        List of email domains for the college
    """
    # Direct match
    if college_name in COLLEGE_DOMAINS:
        return COLLEGE_DOMAINS[college_name]
    
    # Fuzzy match
    college_lower = college_name.lower()
    for name, domains in COLLEGE_DOMAINS.items():
        if name.lower() in college_lower or college_lower in name.lower():
            return domains
    
    # Generic domain construction
    # This is a fallback - you should research actual domains
    clean_name = college_name.lower().replace(' ', '').replace('college', '').replace('engineering', '').replace('of', '')
    generic_domain = f"{clean_name}.edu.in"
    
    logger.warning(f"No specific domain found for {college_name}, using generic: {generic_domain}")
    return [generic_domain]

def main():
    """Test the Hunter API client"""
    # Initialize client (you'll need to set HUNTER_API_KEY environment variable)
    client = HunterAPIClient()
    
    # Test college
    college_name = "HKB College of Engineering"
    domains = get_college_domains(college_name)
    
    logger.info(f"Testing Hunter API for {college_name}")
    logger.info(f"Domains to search: {domains}")
    
    all_profiles = []
    
    for domain in domains:
        # Find emails for this domain
        email_data = client.find_emails_by_domain(domain, limit=50)
        
        if email_data:
            # Extract profiles with LinkedIn data
            profiles = client.extract_linkedin_profiles(email_data)
            all_profiles.extend(profiles)
            
            # Add delay to respect rate limits
            time.sleep(1)
    
    if all_profiles:
        logger.info(f"Found {len(all_profiles)} potential student profiles")
        
        # Save results
        with open('hunter_profiles.json', 'w') as f:
            json.dump(all_profiles, f, indent=2)
        
        # Display sample
        for i, profile in enumerate(all_profiles[:3]):
            print(f"{i+1}. {profile['first_name']} {profile['last_name']}")
            print(f"   Email: {profile['email']}")
            print(f"   Position: {profile['position']}")
            print(f"   LinkedIn: {profile['linkedin_url'] or 'Not found'}")
            print(f"   Confidence: {profile['confidence']}%")
            print()
    else:
        logger.warning("No profiles found with Hunter API")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    main()