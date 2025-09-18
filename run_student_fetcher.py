#!/usr/bin/env python3
"""
Simple CLI interface for LinkedIn Student Data Fetcher
Easy to use command-line interface for fetching student data
"""

import argparse
import sys
import os
import logging
from typing import List

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from linkedin_student_fetcher import LinkedInStudentFetcher
from data_processor import DataAggregator, StudentDataProcessor
from linkedin_api_client import LinkedInAPIClient

def setup_logging(verbose: bool = False):
    """Setup logging configuration"""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

def search_single_college(college_name: str, limit: int = 10, format: str = 'json', verbose: bool = False):
    """Search for students from a single college"""
    setup_logging(verbose)
    logger = logging.getLogger(__name__)
    
    logger.info(f"Searching for students from: {college_name}")
    
    try:
        # Initialize fetcher
        fetcher = LinkedInStudentFetcher()
        
        # Search for students
        students = fetcher.search_students_by_college(college_name, limit=limit)
        
        if not students:
            logger.warning("No students found!")
            return
        
        logger.info(f"Found {len(students)} students")
        
        # Export data
        filename = college_name.lower().replace(' ', '_').replace('&', 'and')
        
        if format.lower() == 'json':
            output_file = fetcher.export_to_json(students, f"{filename}_students.json")
        elif format.lower() == 'csv':
            processor = StudentDataProcessor()
            output_file = processor.export_to_csv(students, f"{filename}_students.csv")
        elif format.lower() == 'excel':
            processor = StudentDataProcessor()
            output_file = processor.export_to_excel(students, f"{filename}_students.xlsx")
        else:
            logger.error(f"Unsupported format: {format}")
            return
        
        logger.info(f"Data exported to: {output_file}")
        
        # Display sample data
        logger.info("Sample student data:")
        for i, student in enumerate(students[:3]):
            logger.info(f"  {i+1}. {student.name} - {student.degree} - {student.graduation_year}")
        
        if len(students) > 3:
            logger.info(f"  ... and {len(students) - 3} more students")
    
    except Exception as e:
        logger.error(f"Error searching for students: {e}")
        sys.exit(1)

def search_multiple_colleges(college_names: List[str], limit: int = 10, format: str = 'json', verbose: bool = False):
    """Search for students from multiple colleges"""
    setup_logging(verbose)
    logger = logging.getLogger(__name__)
    
    logger.info(f"Searching for students from {len(college_names)} colleges")
    
    try:
        # Initialize fetcher
        fetcher = LinkedInStudentFetcher()
        
        all_students = []
        
        # Search each college
        for college in college_names:
            logger.info(f"Processing: {college}")
            students = fetcher.search_students_by_college(college, limit=limit)
            all_students.extend(students)
            logger.info(f"Found {len(students)} students from {college}")
        
        if not all_students:
            logger.warning("No students found!")
            return
        
        logger.info(f"Total students found: {len(all_students)}")
        
        # Export combined data
        processor = StudentDataProcessor()
        
        if format.lower() == 'json':
            output_file = processor.export_to_json(all_students, "multiple_colleges_students.json")
        elif format.lower() == 'csv':
            output_file = processor.export_to_csv(all_students, "multiple_colleges_students.csv")
        elif format.lower() == 'excel':
            output_file = processor.export_to_excel(all_students, "multiple_colleges_students.xlsx")
        else:
            logger.error(f"Unsupported format: {format}")
            return
        
        # Also save to database
        processor.save_to_database(all_students)
        
        logger.info(f"Data exported to: {output_file}")
        logger.info("Data also saved to database: data/students.db")
        
        # Display summary by college
        logger.info("Summary by college:")
        college_counts = {}
        for student in all_students:
            college = student.get('college', 'Unknown')
            college_counts[college] = college_counts.get(college, 0) + 1
        
        for college, count in college_counts.items():
            logger.info(f"  {college}: {count} students")
    
    except Exception as e:
        logger.error(f"Error searching for students: {e}")
        sys.exit(1)

def comprehensive_search(college_name: str, methods: List[str] = None, limit: int = 10, verbose: bool = False):
    """Comprehensive search using multiple data sources"""
    setup_logging(verbose)
    logger = logging.getLogger(__name__)
    
    if methods is None:
        methods = ['mock', 'google_search']  # Safe methods by default
    
    logger.info(f"Running comprehensive search for: {college_name}")
    logger.info(f"Using methods: {', '.join(methods)}")
    
    try:
        # Initialize aggregator
        aggregator = DataAggregator()
        
        # Collect data from multiple sources
        student_data = aggregator.collect_comprehensive_data(college_name, methods=methods)
        
        if not student_data:
            logger.warning("No students found!")
            return
        
        logger.info(f"Found {len(student_data)} students using comprehensive search")
        
        # Export in all formats
        processor = aggregator.processor
        
        filename_base = college_name.lower().replace(' ', '_').replace('&', 'and')
        
        json_file = processor.export_to_json(student_data, f"{filename_base}_comprehensive.json")
        csv_file = processor.export_to_csv(student_data, f"{filename_base}_comprehensive.csv")
        excel_file = processor.export_to_excel(student_data, f"{filename_base}_comprehensive.xlsx")
        
        # Save to database
        processor.save_to_database(student_data)
        
        logger.info("Data exported to:")
        logger.info(f"  JSON: {json_file}")
        logger.info(f"  CSV: {csv_file}")
        logger.info(f"  Excel: {excel_file}")
        logger.info(f"  Database: data/students.db")
        
        # Display summary by data source
        logger.info("Summary by data source:")
        source_counts = {}
        for student in student_data:
            source = student.get('source', 'Unknown')
            source_counts[source] = source_counts.get(source, 0) + 1
        
        for source, count in source_counts.items():
            logger.info(f"  {source}: {count} students")
    
    except Exception as e:
        logger.error(f"Error in comprehensive search: {e}")
        sys.exit(1)

def main():
    """Main CLI interface"""
    parser = argparse.ArgumentParser(
        description="LinkedIn Student Data Fetcher - Fetch college student data from LinkedIn",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Search single college
  python run_student_fetcher.py single "HKB College of Engineering" --limit 20

  # Search multiple colleges
  python run_student_fetcher.py multiple "HKB College of Engineering" "RV College of Engineering" --format csv

  # Comprehensive search with multiple methods
  python run_student_fetcher.py comprehensive "HKB College of Engineering" --methods mock google_search

  # Verbose output
  python run_student_fetcher.py single "HKB College of Engineering" --verbose
        """
    )
    
    parser.add_argument('--verbose', '-v', action='store_true', help='Enable verbose logging')
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Single college search
    single_parser = subparsers.add_parser('single', help='Search students from a single college')
    single_parser.add_argument('college', help='College name (e.g., "HKB College of Engineering")')
    single_parser.add_argument('--limit', '-l', type=int, default=10, help='Maximum number of students (default: 10)')
    single_parser.add_argument('--format', '-f', choices=['json', 'csv', 'excel'], default='json', help='Output format (default: json)')
    
    # Multiple colleges search
    multiple_parser = subparsers.add_parser('multiple', help='Search students from multiple colleges')
    multiple_parser.add_argument('colleges', nargs='+', help='List of college names')
    multiple_parser.add_argument('--limit', '-l', type=int, default=10, help='Maximum number of students per college (default: 10)')
    multiple_parser.add_argument('--format', '-f', choices=['json', 'csv', 'excel'], default='json', help='Output format (default: json)')
    
    # Comprehensive search
    comprehensive_parser = subparsers.add_parser('comprehensive', help='Comprehensive search using multiple methods')
    comprehensive_parser.add_argument('college', help='College name (e.g., "HKB College of Engineering")')
    comprehensive_parser.add_argument('--methods', '-m', nargs='+', 
                                    choices=['mock', 'google_search', 'linkedin_api', 'selenium'],
                                    default=['mock', 'google_search'], 
                                    help='Data collection methods (default: mock google_search)')
    comprehensive_parser.add_argument('--limit', '-l', type=int, default=15, help='Maximum number of students (default: 15)')
    
    # Parse arguments
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    # Execute appropriate command
    if args.command == 'single':
        search_single_college(args.college, args.limit, args.format, args.verbose)
    
    elif args.command == 'multiple':
        search_multiple_colleges(args.colleges, args.limit, args.format, args.verbose)
    
    elif args.command == 'comprehensive':
        comprehensive_search(args.college, args.methods, args.limit, args.verbose)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()