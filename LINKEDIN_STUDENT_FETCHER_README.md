# LinkedIn Student Data Fetcher

A comprehensive tool to fetch college student details from LinkedIn using multiple methods including official APIs, web scraping, and alternative data sources.

## 🚨 Important Legal Notice

**Please read carefully before using this tool:**

- Direct scraping of LinkedIn is against their Terms of Service
- Always use LinkedIn's official API when possible
- Respect rate limits and LinkedIn's robots.txt
- This tool is for educational and research purposes
- Users are responsible for compliance with applicable laws and terms of service

## 🎯 Features

- **Multiple Data Sources**: LinkedIn API, Google Search, College websites
- **Export Formats**: JSON, CSV, Excel, SQLite database
- **College-Specific Search**: Target specific colleges like "HKB College of Engineering"
- **Data Processing**: Comprehensive data cleaning and formatting
- **Rate Limiting**: Built-in delays and retry mechanisms
- **OAuth Authentication**: Secure LinkedIn API access

## 📋 Prerequisites

1. **Python 3.7+** installed on your system
2. **LinkedIn Developer Account** (for API access)
3. **Chrome Browser** (for Selenium scraping)
4. **ChromeDriver** (automatically installed)

## 🛠️ Installation

### 1. Clone or Download the Project

```bash
git clone https://github.com/yourusername/linkedin-student-fetcher.git
cd linkedin-student-fetcher
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up LinkedIn API (Recommended)

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app
3. Get your `Client ID` and `Client Secret`
4. Set redirect URI to `http://localhost:8000/callback`

### 4. Configure Environment Variables

Copy `config.env` to `.env` and update with your credentials:

```bash
cp config.env .env
```

Edit `.env` file:
```env
LINKEDIN_CLIENT_ID=your_actual_client_id
LINKEDIN_CLIENT_SECRET=your_actual_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
```

## 🚀 Quick Start

### Basic Usage

```python
from linkedin_student_fetcher import LinkedInStudentFetcher

# Initialize the fetcher
fetcher = LinkedInStudentFetcher()

# Search for students from HKB College of Engineering
students = fetcher.search_students_by_college("HKB College of Engineering", limit=10)

# Export to JSON
fetcher.export_to_json(students, "hkb_students.json")
```

### Using the Data Processor

```python
from data_processor import DataAggregator

# Initialize aggregator
aggregator = DataAggregator()

# Collect comprehensive data
student_data = aggregator.collect_comprehensive_data(
    "HKB College of Engineering",
    methods=['mock', 'google_search']  # Safe methods
)

# Export in multiple formats
processor = aggregator.processor
processor.export_to_json(student_data)
processor.export_to_csv(student_data)
processor.export_to_excel(student_data)
processor.save_to_database(student_data)
```

### Command Line Usage

```bash
# Run the main script
python linkedin_student_fetcher.py

# Run data processor
python data_processor.py
```

## 🏫 College-Specific Examples

### HKB College of Engineering

```python
# Search specifically for HKB College students
college_name = "HKB College of Engineering"
students = fetcher.search_students_by_college(college_name, limit=20)

# Filter by department (if available)
cse_students = [s for s in students if 'Computer Science' in s.get('degree', '')]

# Export filtered results
fetcher.export_to_json(cse_students, "hkb_cse_students.json")
```

### Multiple Colleges

```python
colleges = [
    "HKB College of Engineering",
    "RV College of Engineering", 
    "BMS College of Engineering"
]

all_results = fetcher.search_multiple_colleges(colleges, limit_per_college=15)
```

## 📊 Data Structure

Each student record contains:

```json
{
  "name": "Student Name",
  "college": "HKB College of Engineering",
  "degree": "Computer Science Engineering",
  "graduation_year": "2024",
  "location": "Bangalore, Karnataka, India",
  "headline": "CSE Student | Python Developer",
  "profile_url": "https://linkedin.com/in/student-profile",
  "connections": 150,
  "skills": ["Python", "Java", "React"],
  "experience": [
    {
      "title": "Software Intern",
      "company": "Tech Company",
      "duration": "3 months",
      "description": "Worked on web development"
    }
  ]
}
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LINKEDIN_CLIENT_ID` | LinkedIn app client ID | Yes |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn app client secret | Yes |
| `LINKEDIN_ACCESS_TOKEN` | OAuth access token | Optional |
| `GOOGLE_SEARCH_API_KEY` | Google Search API key | Optional |
| `SCRAPING_DELAY_MIN` | Minimum delay between requests | No |
| `SCRAPING_DELAY_MAX` | Maximum delay between requests | No |

### Data Collection Methods

1. **Mock Data** (`mock`): Safe, generates realistic sample data
2. **Google Search** (`google_search`): Searches Google for LinkedIn profiles
3. **LinkedIn API** (`linkedin_api`): Official API (requires authentication)
4. **Selenium Scraping** (`selenium`): Direct scraping (use with caution)

## 📈 Output Formats

### JSON Output
```json
[
  {
    "name": "Student 1",
    "college": "HKB College of Engineering",
    ...
  }
]
```

### CSV Output
Flat structure with all fields as columns.

### Excel Output
Formatted spreadsheet with proper headers and data types.

### SQLite Database
Structured database with relationships and indexing.

## 🛡️ Rate Limiting and Best Practices

### LinkedIn API
- Respect rate limits (varies by endpoint)
- Use exponential backoff for retries
- Cache results to avoid repeated requests

### Web Scraping
- Add delays between requests (1-3 seconds)
- Rotate User-Agent strings
- Respect robots.txt
- Monitor for IP blocking

### Example Rate Limiting

```python
import time
import random

# Add random delays
time.sleep(random.uniform(1, 3))

# Implement exponential backoff
for attempt in range(max_retries):
    try:
        # Make request
        response = make_request()
        break
    except RateLimitError:
        delay = 2 ** attempt
        time.sleep(delay)
```

## 🔍 Troubleshooting

### Common Issues

1. **LinkedIn API Rate Limiting**
   - Reduce request frequency
   - Implement proper backoff strategies
   - Check API quotas

2. **ChromeDriver Issues**
   - Ensure Chrome browser is installed
   - Check ChromeDriver version compatibility
   - Run with `--headless` for server environments

3. **Authentication Errors**
   - Verify LinkedIn app credentials
   - Check redirect URI configuration
   - Ensure proper OAuth scopes

### Debug Mode

```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Run with verbose output
fetcher = LinkedInStudentFetcher()
fetcher.search_students_by_college("College Name", limit=5)
```

## 📄 Example Scripts

### Basic Student Search

```python
#!/usr/bin/env python3
from linkedin_student_fetcher import LinkedInStudentFetcher

def search_college_students():
    fetcher = LinkedInStudentFetcher()
    
    college = "HKB College of Engineering"
    students = fetcher.search_students_by_college(college, limit=25)
    
    print(f"Found {len(students)} students from {college}")
    
    # Export results
    filename = college.lower().replace(' ', '_') + '_students.json'
    fetcher.export_to_json(students, filename)
    print(f"Data exported to {filename}")

if __name__ == "__main__":
    search_college_students()
```

### Advanced Data Collection

```python
#!/usr/bin/env python3
from data_processor import DataAggregator
import logging

def comprehensive_data_collection():
    logging.basicConfig(level=logging.INFO)
    
    aggregator = DataAggregator()
    
    # Target colleges
    colleges = [
        "HKB College of Engineering",
        "RV College of Engineering",
        "BMS College of Engineering"
    ]
    
    all_data = []
    
    for college in colleges:
        print(f"Processing {college}...")
        
        data = aggregator.collect_comprehensive_data(
            college,
            methods=['mock', 'google_search']
        )
        
        all_data.extend(data)
        print(f"Collected {len(data)} records from {college}")
    
    # Export combined data
    processor = aggregator.processor
    processor.export_to_json(all_data, "all_colleges_comprehensive.json")
    processor.export_to_csv(all_data, "all_colleges_comprehensive.csv")
    processor.save_to_database(all_data)
    
    print(f"Total records: {len(all_data)}")

if __name__ == "__main__":
    comprehensive_data_collection()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is provided for educational and research purposes only. Users must:

- Comply with LinkedIn's Terms of Service
- Respect website robots.txt files
- Follow applicable laws and regulations
- Use data responsibly and ethically

The authors are not responsible for misuse of this tool or any violations of terms of service.

## 🆘 Support

- Create an issue on GitHub for bugs
- Check existing issues before creating new ones
- Provide detailed error messages and system information

## 🔗 Useful Links

- [LinkedIn Developer Documentation](https://developer.linkedin.com/)
- [LinkedIn API v2 Guide](https://docs.microsoft.com/en-us/linkedin/)
- [Python Requests Documentation](https://requests.readthedocs.io/)
- [Selenium Documentation](https://selenium-python.readthedocs.io/)