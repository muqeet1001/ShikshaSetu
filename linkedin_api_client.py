#!/usr/bin/env python3
"""
LinkedIn API Client
Real LinkedIn API integration for fetching student data
"""

import requests
import json
import time
import os
from typing import Dict, List, Optional, Any
import logging
from urllib.parse import quote_plus, urlencode
import base64
import hashlib
import secrets

logger = logging.getLogger(__name__)

class LinkedInAPIClient:
    """LinkedIn API client with OAuth 2.0 authentication"""
    
    def __init__(self, client_id: str = None, client_secret: str = None, access_token: str = None):
        """
        Initialize LinkedIn API client
        
        Args:
            client_id: LinkedIn application client ID
            client_secret: LinkedIn application client secret
            access_token: Existing access token (optional)
        """
        self.client_id = client_id or os.getenv('LINKEDIN_CLIENT_ID')
        self.client_secret = client_secret or os.getenv('LINKEDIN_CLIENT_SECRET')
        self.access_token = access_token or os.getenv('LINKEDIN_ACCESS_TOKEN')
        
        self.base_url = "https://api.linkedin.com/v2"
        self.auth_url = "https://www.linkedin.com/oauth/v2/authorization"
        self.token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        
        self.headers = {
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0'
        }
        
        if self.access_token:
            self.headers['Authorization'] = f'Bearer {self.access_token}'
    
    def get_authorization_url(self, redirect_uri: str, scopes: List[str] = None) -> str:
        """
        Get LinkedIn OAuth authorization URL
        
        Args:
            redirect_uri: Your application's redirect URI
            scopes: List of requested scopes
            
        Returns:
            Authorization URL
        """
        if scopes is None:
            scopes = ['r_liteprofile', 'r_emailaddress', 'w_member_social']
        
        state = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')
        
        params = {
            'response_type': 'code',
            'client_id': self.client_id,
            'redirect_uri': redirect_uri,
            'state': state,
            'scope': ' '.join(scopes)
        }
        
        return f"{self.auth_url}?{urlencode(params)}"
    
    def exchange_code_for_token(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        """
        Exchange authorization code for access token
        
        Args:
            code: Authorization code from LinkedIn
            redirect_uri: Your application's redirect URI
            
        Returns:
            Token response containing access_token
        """
        data = {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirect_uri,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        }
        
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        
        response = requests.post(self.token_url, data=data, headers=headers)
        response.raise_for_status()
        
        token_data = response.json()
        self.access_token = token_data.get('access_token')
        self.headers['Authorization'] = f'Bearer {self.access_token}'
        
        return token_data
    
    def get_profile(self, profile_id: str = 'me') -> Dict[str, Any]:
        """
        Get LinkedIn profile information
        
        Args:
            profile_id: Profile ID or 'me' for current user
            
        Returns:
            Profile data
        """
        url = f"{self.base_url}/people/{profile_id}"
        params = {
            'projection': '(id,firstName,lastName,headline,location,industryName,summary,positions,educations,skills,honors)'
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        return response.json()
    
    def search_people(self, keywords: str = None, school: str = None, current_company: str = None, 
                     location: str = None, industry: str = None, limit: int = 10) -> Dict[str, Any]:
        """
        Search for people on LinkedIn
        
        Args:
            keywords: Search keywords
            school: School/university name
            current_company: Current company name
            location: Location
            industry: Industry
            limit: Maximum results
            
        Returns:
            Search results
        """
        url = f"{self.base_url}/peopleSearch"
        
        params = {
            'start': 0,
            'count': limit
        }
        
        # Build search facets
        facets = []
        if school:
            facets.append(f'school:{quote_plus(school)}')
        if current_company:
            facets.append(f'currentCompany:{quote_plus(current_company)}')
        if location:
            facets.append(f'location:{quote_plus(location)}')
        if industry:
            facets.append(f'industry:{quote_plus(industry)}')
        
        if facets:
            params['facets'] = ','.join(facets)
        
        if keywords:
            params['keywords'] = keywords
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        return response.json()
    
    def get_school_alumni(self, school_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get alumni from a specific school
        
        Args:
            school_id: LinkedIn school ID
            limit: Maximum results
            
        Returns:
            List of alumni profiles
        """
        try:
            # Use people search with school filter
            results = self.search_people(school=school_id, limit=limit)
            
            alumni = []
            if 'elements' in results:
                for person in results['elements']:
                    alumni.append(self._parse_person_data(person))
            
            return alumni
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching school alumni: {e}")
            return []
    
    def _parse_person_data(self, person_data: Dict) -> Dict[str, Any]:
        """Parse person data from LinkedIn API response"""
        parsed = {
            'id': person_data.get('id'),
            'firstName': person_data.get('firstName', {}).get('localized', {}).get('en_US', ''),
            'lastName': person_data.get('lastName', {}).get('localized', {}).get('en_US', ''),
            'headline': person_data.get('headline', {}).get('localized', {}).get('en_US', ''),
            'location': None,
            'industry': person_data.get('industryName'),
            'educations': [],
            'positions': [],
            'skills': []
        }
        
        # Parse location
        if 'location' in person_data:
            location_data = person_data['location']
            if 'name' in location_data:
                parsed['location'] = location_data['name']['localized']['en_US']
        
        # Parse educations
        if 'educations' in person_data:
            for edu in person_data['educations']['elements']:
                education = {
                    'schoolName': edu.get('schoolName'),
                    'fieldOfStudy': edu.get('fieldOfStudy'),
                    'degreeName': edu.get('degreeName'),
                    'startDate': edu.get('timePeriod', {}).get('startDate'),
                    'endDate': edu.get('timePeriod', {}).get('endDate')
                }
                parsed['educations'].append(education)
        
        # Parse positions/experience
        if 'positions' in person_data:
            for pos in person_data['positions']['elements']:
                position = {
                    'title': pos.get('title'),
                    'companyName': pos.get('companyName'),
                    'description': pos.get('description'),
                    'startDate': pos.get('timePeriod', {}).get('startDate'),
                    'endDate': pos.get('timePeriod', {}).get('endDate')
                }
                parsed['positions'].append(position)
        
        # Parse skills
        if 'skills' in person_data:
            for skill in person_data['skills']['elements']:
                parsed['skills'].append(skill.get('name'))
        
        return parsed
    
    def get_company_employees(self, company_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get employees of a specific company
        
        Args:
            company_id: LinkedIn company ID
            limit: Maximum results
            
        Returns:
            List of employee profiles
        """
        try:
            results = self.search_people(current_company=company_id, limit=limit)
            
            employees = []
            if 'elements' in results:
                for person in results['elements']:
                    employees.append(self._parse_person_data(person))
            
            return employees
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching company employees: {e}")
            return []
    
    def rate_limit_handler(self, func, *args, **kwargs):
        """Handle rate limiting with exponential backoff"""
        max_retries = 3
        base_delay = 1
        
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs)
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 429:  # Rate limited
                    delay = base_delay * (2 ** attempt)
                    logger.warning(f"Rate limited. Waiting {delay} seconds before retry {attempt + 1}/{max_retries}")
                    time.sleep(delay)
                    continue
                else:
                    raise
        
        raise Exception(f"Max retries ({max_retries}) exceeded for rate limited request")

# Example school IDs (you would need to find the actual LinkedIn IDs)
SCHOOL_IDS = {
    'HKB College of Engineering': 'hkb-college-engineering',
    'RV College of Engineering': 'rv-college-engineering',
    'BMS College of Engineering': 'bms-college-engineering'
}

def find_school_linkedin_id(school_name: str) -> Optional[str]:
    """
    Helper function to find LinkedIn school ID
    Note: In practice, you'd need to use LinkedIn's School API or search
    """
    return SCHOOL_IDS.get(school_name)