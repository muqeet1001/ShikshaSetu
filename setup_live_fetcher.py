#!/usr/bin/env python3
"""
Setup and Usage Script for Live LinkedIn Student Data Fetcher
Easy setup guide for Hunter.io and Scraping APIs
"""

import os
import sys
import requests
import json

def print_header():
    """Print setup header"""
    print("🎯 Live LinkedIn Student Data Fetcher Setup")
    print("=" * 50)
    print()

def check_api_keys():
    """Check if API keys are configured"""
    print("📋 Checking API Key Configuration...")
    
    hunter_key = os.getenv('HUNTER_API_KEY')
    scrape_key = os.getenv('SCRAPE_API_KEY')
    
    print(f"✅ Hunter.io API Key: {'Set' if hunter_key else '❌ Not Set'}")
    print(f"✅ Scraping API Key: {'Set' if scrape_key else '❌ Not Set'}")
    
    if not hunter_key and not scrape_key:
        print("\n⚠️  No API keys found! You need at least one API key to get real data.")
        return False
    
    return True

def setup_instructions():
    """Print setup instructions"""
    print("\n📝 Setup Instructions:")
    print("-" * 30)
    
    print("\n1️⃣ Get Hunter.io API Key (Recommended):")
    print("   - Go to: https://hunter.io/")
    print("   - Sign up for free account")
    print("   - Go to API section: https://hunter.io/api-keys")
    print("   - Copy your API key")
    print("   - Set environment variable: HUNTER_API_KEY=your_key_here")
    
    print("\n2️⃣ Get Scraping API Key (Required for LinkedIn profiles):")
    print("   Option A - ScrapingBee (Recommended):")
    print("   - Go to: https://scrapingbee.com/")
    print("   - Sign up for free trial (1000 API calls)")
    print("   - Get API key from dashboard")
    print("   - Set environment variable: SCRAPE_API_KEY=your_key_here")
    
    print("\n   Option B - ScrapeOwl:")
    print("   - Go to: https://scrapeowl.com/")
    print("   - Sign up for free trial")
    print("   - Get API key")
    
    print("\n   Option C - ScrapFly:")
    print("   - Go to: https://scrapfly.io/")
    print("   - Sign up for free trial")
    print("   - Get API key")

def set_environment_variables():
    """Interactive setup for environment variables"""
    print("\n🔧 Environment Variable Setup:")
    print("-" * 30)
    
    # Hunter.io setup
    hunter_key = input("Enter your Hunter.io API key (or press Enter to skip): ").strip()
    if hunter_key:
        os.environ['HUNTER_API_KEY'] = hunter_key
        print("✅ Hunter.io API key set for this session")
    
    # Scraping API setup
    scrape_key = input("Enter your Scraping API key: ").strip()
    if scrape_key:
        os.environ['SCRAPE_API_KEY'] = scrape_key
        
        service = input("Which scraping service? (scrapingbee/scrapeowl/scrapfly) [scrapingbee]: ").strip().lower()
        if not service:
            service = 'scrapingbee'
        
        os.environ['SCRAPE_SERVICE'] = service
        print(f"✅ {service} API key set for this session")
        return True
    else:
        print("❌ Scraping API key is required!")
        return False

def test_apis():
    """Test API connections"""
    print("\n🧪 Testing API Connections...")
    print("-" * 30)
    
    hunter_key = os.getenv('HUNTER_API_KEY')
    scrape_key = os.getenv('SCRAPE_API_KEY')
    
    # Test Hunter.io API
    if hunter_key:
        try:
            print("Testing Hunter.io API...")
            url = "https://api.hunter.io/v2/domain-search"
            params = {
                'domain': 'google.com',
                'api_key': hunter_key,
                'limit': 1
            }
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data'):
                    print("✅ Hunter.io API working correctly!")
                else:
                    print("⚠️  Hunter.io API connected but no data returned")
            else:
                print(f"❌ Hunter.io API error: {response.status_code}")
        except Exception as e:
            print(f"❌ Hunter.io API test failed: {e}")
    
    # Test Scraping API
    if scrape_key:
        service = os.getenv('SCRAPE_SERVICE', 'scrapingbee')
        try:
            print(f"Testing {service} API...")
            
            if service == 'scrapingbee':
                url = "https://app.scrapingbee.com/api/v1"
                params = {
                    'api_key': scrape_key,
                    'url': 'https://httpbin.org/status/200'
                }
            else:
                print("⚠️  API test not implemented for this service, but should work")
                return
            
            response = requests.get(url, params=params, timeout=30)
            
            if response.status_code == 200:
                print(f"✅ {service} API working correctly!")
            else:
                print(f"❌ {service} API error: {response.status_code}")
        except Exception as e:
            print(f"❌ {service} API test failed: {e}")

def run_sample_fetch():
    """Run a sample data fetch"""
    print("\n🚀 Running Sample Data Fetch...")
    print("-" * 30)
    
    try:
        # Import our live fetcher
        from live_linkedin_fetcher import LiveLinkedInFetcher
        
        # Initialize with environment variables
        fetcher = LiveLinkedInFetcher()
        
        # Test with a small fetch
        college_name = "HKB College of Engineering"
        print(f"Fetching sample data for: {college_name}")
        
        students = fetcher.fetch_college_students(college_name, limit=3, methods=['search'])
        
        if students:
            print(f"\n✅ Success! Found {len(students)} student profiles:")
            
            for i, student in enumerate(students, 1):
                name = student.get('name', 'N/A')
                degree = student.get('degree', 'N/A')
                status = student.get('student_status', 'N/A')
                method = student.get('method', 'N/A')
                
                print(f"  {i}. {name}")
                print(f"     Degree: {degree}")
                print(f"     Status: {status}")
                print(f"     Source: {method}")
                print()
            
            print("📁 Results saved in live_results/ directory")
        else:
            print("❌ No student data found. This might be normal for a test run.")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all Python files are in the same directory.")
    except Exception as e:
        print(f"❌ Sample fetch failed: {e}")

def show_usage_examples():
    """Show usage examples"""
    print("\n💡 Usage Examples:")
    print("-" * 30)
    
    examples = [
        {
            'title': 'Basic Usage',
            'code': '''from live_linkedin_fetcher import LiveLinkedInFetcher

fetcher = LiveLinkedInFetcher()
students = fetcher.fetch_college_students("HKB College of Engineering", limit=20)
print(f"Found {len(students)} students")'''
        },
        {
            'title': 'Hunter.io Only',
            'code': '''fetcher = LiveLinkedInFetcher()
students = fetcher.fetch_college_students("HKB College of Engineering", 
                                        limit=15, methods=['hunter'])'''
        },
        {
            'title': 'Search Only',
            'code': '''fetcher = LiveLinkedInFetcher()
students = fetcher.fetch_college_students("HKB College of Engineering", 
                                        limit=10, methods=['search'])'''
        },
        {
            'title': 'Different College',
            'code': '''students = fetcher.fetch_college_students("RV College of Engineering", 
                                        limit=25)'''
        }
    ]
    
    for example in examples:
        print(f"\n{example['title']}:")
        print("```python")
        print(example['code'])
        print("```")

def main():
    """Main setup function"""
    print_header()
    
    # Check current API key status
    has_keys = check_api_keys()
    
    if not has_keys:
        setup_instructions()
        
        setup_choice = input("\n🔧 Would you like to set up API keys now? (y/n): ").lower().startswith('y')
        
        if setup_choice:
            if not set_environment_variables():
                print("\n❌ Setup incomplete. Please get API keys and try again.")
                return
        else:
            print("\n📋 Setup skipped. Get API keys and set environment variables manually.")
            return
    
    # Test APIs if we have keys
    if os.getenv('HUNTER_API_KEY') or os.getenv('SCRAPE_API_KEY'):
        test_choice = input("\n🧪 Would you like to test API connections? (y/n): ").lower().startswith('y')
        
        if test_choice:
            test_apis()
    
    # Run sample fetch
    sample_choice = input("\n🚀 Would you like to run a sample data fetch? (y/n): ").lower().startswith('y')
    
    if sample_choice:
        run_sample_fetch()
    
    # Show usage examples
    examples_choice = input("\n💡 Would you like to see usage examples? (y/n): ").lower().startswith('y')
    
    if examples_choice:
        show_usage_examples()
    
    print("\n🎉 Setup Complete!")
    print("\nNext Steps:")
    print("1. Run: python live_linkedin_fetcher.py")
    print("2. Or use the LiveLinkedInFetcher class in your own code")
    print("3. Check the live_results/ directory for output files")
    
    print("\n📚 Documentation:")
    print("- README: LINKEDIN_STUDENT_FETCHER_README.md")
    print("- Hunter.io docs: https://hunter.io/api-documentation")
    print("- ScrapingBee docs: https://scrapingbee.com/documentation")

if __name__ == "__main__":
    main()