#!/usr/bin/env python3
"""
Scrape API Client for LinkedIn
Extract detailed LinkedIn profile data using ScrapingBee or similar scraping APIs
"""

import requests
import json
import time
import os
import re
from typing import Dict, List, Optional, Any
import logging
from urllib.parse import quote_plus, urlparse
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class ScrapeAPIClient:
    """Client for scraping LinkedIn profiles using various scraping APIs"""
    
    def __init__(self, api_key: str = None, service: str = 'scrapingbee'):
        """
        Initialize Scrape API client
        
        Args:
            api_key: API key for the scraping service
            service: Scraping service to use ('scrapingbee', 'scrapeowl', 'scrapfly')
        """
        self.api_key = api_key or os.getenv('SCRAPE_API_KEY')
        self.service = service.lower()
        
        # Configure API endpoints based on service
        if self.service == 'scrapingbee':
            self.base_url = "https://app.scrapingbee.com/api/v1"
            self.api_param = 'api_key'
        elif self.service == 'scrapeowl':
            self.base_url = "https://api.scrapeowl.com/v1/scrape"
            self.api_param = 'api_key'
        elif self.service == 'scrapfly':
            self.base_url = "https://api.scrapfly.io/scrape"
            self.api_param = 'key'
        else:
            logger.warning(f"Unknown scraping service: {service}")
            self.base_url = "https://app.scrapingbee.com/api/v1"
            self.api_param = 'api_key'
        
        if not self.api_key:
            logger.warning(f"No {self.service} API key provided. Please get one from the service provider.")
    
    def scrape_linkedin_profile(self, linkedin_url: str) -> Dict[str, Any]:
        """
        Scrape a LinkedIn profile page
        
        Args:
            linkedin_url: LinkedIn profile URL
            
        Returns:
            Dictionary containing scraped profile data
        """
        if not self.api_key:
            logger.error("API key is required for scraping")
            return {}
        
        if not linkedin_url or 'linkedin.com' not in linkedin_url.lower():
            logger.error(f"Invalid LinkedIn URL: {linkedin_url}")
            return {}
        
        try:
            logger.info(f"Scraping LinkedIn profile: {linkedin_url}")
            
            # Configure parameters based on service
            if self.service == 'scrapingbee':
                params = {
                    self.api_param: self.api_key,
                    'url': linkedin_url,
                    'render_js': 'true',
                    'premium_proxy': 'true',
                    'country_code': 'us'
                }
            elif self.service == 'scrapeowl':
                params = {
                    self.api_param: self.api_key,
                    'url': linkedin_url,
                    'render_js': 'true',
                    'proxy_country': 'US'
                }
            else:  # scrapfly or default
                params = {
                    self.api_param: self.api_key,
                    'url': linkedin_url,
                    'render_js': 'true',
                    'country': 'US'
                }
            
            response = requests.get(self.base_url, params=params, timeout=60)
            response.raise_for_status()
            
            # Parse the HTML content
            if self.service == 'scrapfly':
                # ScrapFly returns JSON
                data = response.json()
                html_content = data.get('result', {}).get('content', '')
            else:
                # Other services return HTML directly
                html_content = response.text
            
            if html_content:
                profile_data = self._parse_linkedin_html(html_content, linkedin_url)
                return profile_data
            else:
                logger.error("No HTML content received")
                return {}
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error scraping LinkedIn profile: {e}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {}
    
    def _parse_linkedin_html(self, html_content: str, linkedin_url: str) -> Dict[str, Any]:
        """
        Parse LinkedIn HTML content to extract profile information
        
        Args:
            html_content: HTML content of the LinkedIn profile
            linkedin_url: Original LinkedIn URL
            
        Returns:
            Dictionary containing parsed profile data
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            profile_data = {
                'linkedin_url': linkedin_url,
                'name': '',
                'headline': '',
                'location': '',
                'about': '',
                'experience': [],
                'education': [],
                'skills': [],
                'connections': '',
                'source': 'Scrape API',
                'raw_data_available': True
            }
            
            # Extract name
            name_selectors = [
                'h1[class*="text-heading-xlarge"]',
                '.pv-text-details__left-panel h1',
                'h1.text-heading-xlarge',
                '.top-card-layout__title',
                '.pv-top-card--list li:first-child h1'
            ]
            
            for selector in name_selectors:
                name_elem = soup.select_one(selector)
                if name_elem:
                    profile_data['name'] = name_elem.get_text(strip=True)
                    break
            
            # Extract headline
            headline_selectors = [
                'div[class*="text-body-medium break-words"]',
                '.pv-text-details__left-panel .text-body-medium',
                '.top-card-layout__headline',
                '.pv-top-card--list-bullet .text-body-medium'
            ]
            
            for selector in headline_selectors:
                headline_elem = soup.select_one(selector)
                if headline_elem:
                    profile_data['headline'] = headline_elem.get_text(strip=True)
                    break
            
            # Extract location
            location_selectors = [
                'span[class*="text-body-small inline t-black--light break-words"]',
                '.pv-text-details__left-panel .text-body-small',
                '.top-card-layout__first-subline',
                '.pv-top-card__location'
            ]
            
            for selector in location_selectors:
                location_elem = soup.select_one(selector)
                if location_elem:
                    location_text = location_elem.get_text(strip=True)
                    # Clean up location text
                    if 'connections' not in location_text.lower():
                        profile_data['location'] = location_text
                        break
            
            # Extract about section
            about_selectors = [
                '#about + * .pv-shared-text-with-see-more',
                '.pv-about__summary-text',
                'section[data-section="summary"] .pv-shared-text-with-see-more'
            ]
            
            for selector in about_selectors:
                about_elem = soup.select_one(selector)
                if about_elem:
                    profile_data['about'] = about_elem.get_text(strip=True)
                    break
            
            # Extract experience
            experience_items = soup.select('.pv-entity__summary-info, .pv-profile-section__list-item')
            for item in experience_items[:5]:  # Limit to first 5 experiences
                title_elem = item.select_one('h3, .pv-entity__summary-info-v2 h3')
                company_elem = item.select_one('.pv-entity__secondary-title, .pv-entity__summary-info-v2 .text-body-small')
                
                if title_elem:
                    experience = {
                        'title': title_elem.get_text(strip=True),
                        'company': company_elem.get_text(strip=True) if company_elem else '',
                        'duration': ''
                    }
                    
                    # Try to extract duration
                    duration_elem = item.select_one('.pv-entity__bullet-item, .pv-entity__date-range')
                    if duration_elem:
                        experience['duration'] = duration_elem.get_text(strip=True)
                    
                    profile_data['experience'].append(experience)
            
            # Extract education
            education_items = soup.select('.pv-profile-section.education .pv-entity__summary-info')
            for item in education_items:
                school_elem = item.select_one('h3')
                degree_elem = item.select_one('.pv-entity__degree-name .pv-entity__comma-item')
                
                if school_elem:
                    education = {
                        'school': school_elem.get_text(strip=True),
                        'degree': degree_elem.get_text(strip=True) if degree_elem else '',
                        'field_of_study': '',
                        'dates': ''
                    }
                    
                    # Try to extract field of study
                    field_elem = item.select_one('.pv-entity__fos .pv-entity__comma-item')
                    if field_elem:
                        education['field_of_study'] = field_elem.get_text(strip=True)
                    
                    # Try to extract dates
                    dates_elem = item.select_one('.pv-entity__dates .pv-entity__comma-item')
                    if dates_elem:
                        education['dates'] = dates_elem.get_text(strip=True)
                    
                    profile_data['education'].append(education)
            
            # Extract skills
            skill_items = soup.select('.pv-skill-category-entity__name-text, .pv-skill-entity__skill-name')
            for item in skill_items[:10]:  # Limit to first 10 skills
                skill_text = item.get_text(strip=True)
                if skill_text and skill_text not in profile_data['skills']:
                    profile_data['skills'].append(skill_text)
            
            # Extract connections count
            connections_elem = soup.select_one('.t-bold .t-black, .pv-top-card--list-bullet .t-bold')
            if connections_elem:
                connections_text = connections_elem.get_text(strip=True)
                if 'connection' in connections_text.lower():
                    profile_data['connections'] = connections_text
            
            # Clean up empty fields
            profile_data = {k: v for k, v in profile_data.items() if v}
            
            logger.info(f"Successfully parsed LinkedIn profile for: {profile_data.get('name', 'Unknown')}")
            return profile_data
            
        except Exception as e:
            logger.error(f"Error parsing LinkedIn HTML: {e}")
            return {}
    
    def scrape_multiple_profiles(self, linkedin_urls: List[str], delay: float = 2.0) -> List[Dict[str, Any]]:
        """
        Scrape multiple LinkedIn profiles with rate limiting
        
        Args:
            linkedin_urls: List of LinkedIn profile URLs
            delay: Delay between requests in seconds
            
        Returns:
            List of profile data dictionaries
        """
        profiles = []
        
        for i, url in enumerate(linkedin_urls):
            logger.info(f"Scraping profile {i+1}/{len(linkedin_urls)}")
            
            profile_data = self.scrape_linkedin_profile(url)
            if profile_data:
                profiles.append(profile_data)
            
            # Rate limiting
            if i < len(linkedin_urls) - 1:  # Don't sleep after the last request
                time.sleep(delay)
        
        logger.info(f"Successfully scraped {len(profiles)} out of {len(linkedin_urls)} profiles")
        return profiles
    
    def search_linkedin_profiles(self, search_query: str, limit: int = 10) -> List[str]:
        """
        Search for LinkedIn profiles using Google search
        
        Args:
            search_query: Search query (e.g., "HKB College of Engineering students")
            limit: Maximum number of URLs to return
            
        Returns:
            List of LinkedIn profile URLs
        """
        if not self.api_key:
            logger.error("API key is required for searching")
            return []
        
        # Construct Google search query for LinkedIn profiles
        google_query = f'site:linkedin.com/in "{search_query}" students'
        google_search_url = f"https://www.google.com/search?q={quote_plus(google_query)}"
        
        try:
            logger.info(f"Searching for LinkedIn profiles: {search_query}")
            
            # Use scraping API to search Google
            params = {
                self.api_param: self.api_key,
                'url': google_search_url,
                'render_js': 'false'  # Google search doesn't need JS rendering
            }
            
            response = requests.get(self.base_url, params=params, timeout=30)
            response.raise_for_status()
            
            html_content = response.text
            linkedin_urls = self._extract_linkedin_urls_from_search(html_content, limit)
            
            logger.info(f"Found {len(linkedin_urls)} LinkedIn profile URLs")
            return linkedin_urls
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error searching for LinkedIn profiles: {e}")
            return []
    
    def _extract_linkedin_urls_from_search(self, html_content: str, limit: int) -> List[str]:
        """
        Extract LinkedIn profile URLs from Google search results
        
        Args:
            html_content: HTML content of Google search results
            limit: Maximum number of URLs to extract
            
        Returns:
            List of LinkedIn profile URLs
        """
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Find all links in search results
            links = soup.select('a[href*="linkedin.com/in/"]')
            linkedin_urls = []
            
            for link in links:
                href = link.get('href', '')
                
                # Clean up the URL (remove Google redirect parameters)
                if '/url?q=' in href:
                    # Extract the actual URL from Google redirect
                    match = re.search(r'/url\?q=([^&]+)', href)
                    if match:
                        href = match.group(1)
                
                # Validate and clean LinkedIn URL
                if 'linkedin.com/in/' in href and href not in linkedin_urls:
                    # Remove any trailing parameters
                    clean_url = href.split('?')[0].split('#')[0]
                    linkedin_urls.append(clean_url)
                
                if len(linkedin_urls) >= limit:
                    break
            
            return linkedin_urls[:limit]
            
        except Exception as e:
            logger.error(f"Error extracting LinkedIn URLs: {e}")
            return []

def main():
    """Test the Scrape API client"""
    # Initialize client (you'll need to set SCRAPE_API_KEY environment variable)
    client = ScrapeAPIClient(service='scrapingbee')
    
    # Test search for LinkedIn profiles
    college_name = "HKB College of Engineering"
    search_query = f"{college_name} students"
    
    logger.info(f"Searching for LinkedIn profiles: {search_query}")
    
    # Search for LinkedIn profiles
    linkedin_urls = client.search_linkedin_profiles(search_query, limit=5)
    
    if linkedin_urls:
        logger.info(f"Found {len(linkedin_urls)} LinkedIn URLs:")
        for url in linkedin_urls:
            print(f"  - {url}")
        
        # Scrape the first few profiles
        logger.info("Scraping profile details...")
        profiles = client.scrape_multiple_profiles(linkedin_urls[:2], delay=3.0)
        
        if profiles:
            # Save results
            with open('scraped_profiles.json', 'w', encoding='utf-8') as f:
                json.dump(profiles, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Scraped {len(profiles)} profiles successfully")
            
            # Display sample data
            for i, profile in enumerate(profiles):
                print(f"\nProfile {i+1}:")
                print(f"  Name: {profile.get('name', 'N/A')}")
                print(f"  Headline: {profile.get('headline', 'N/A')}")
                print(f"  Location: {profile.get('location', 'N/A')}")
                print(f"  Education: {len(profile.get('education', []))} entries")
                print(f"  Experience: {len(profile.get('experience', []))} entries")
                print(f"  Skills: {len(profile.get('skills', []))} skills")
        else:
            logger.warning("No profiles were scraped successfully")
    else:
        logger.warning("No LinkedIn URLs found")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    main()