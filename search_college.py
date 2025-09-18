#!/usr/bin/env python3
"""
Simple College Student Search
Easy script to search for students from any college
"""

from linkedin_student_fetcher import LinkedInStudentFetcher
import json

def search_students():
    # Initialize the fetcher
    fetcher = LinkedInStudentFetcher()
    
    # Get college name from user
    print("=== LinkedIn Student Data Fetcher ===")
    print("Enter the college name you want to search for:")
    college_name = input("College: ").strip()
    
    if not college_name:
        college_name = "HKB College of Engineering"  # Default
        print(f"Using default: {college_name}")
    
    # Get number of students
    try:
        limit = int(input("How many students to fetch (default 10): ").strip() or "10")
    except ValueError:
        limit = 10
    
    print(f"\nSearching for {limit} students from {college_name}...")
    
    # Search for students
    students = fetcher.search_students_by_college(college_name, limit=limit)
    
    if students:
        print(f"\n✅ Found {len(students)} students!")
        
        # Display sample data
        print("\nSample Students:")
        for i, student in enumerate(students[:3]):
            print(f"  {i+1}. {student.name}")
            print(f"     Degree: {student.degree}")
            print(f"     Year: {student.graduation_year}")
            print(f"     Location: {student.location}")
            print(f"     Skills: {', '.join(student.skills) if student.skills else 'N/A'}")
            print()
        
        # Save to file
        filename = college_name.lower().replace(' ', '_').replace('&', 'and') + '_students.json'
        fetcher.export_to_json(students, filename)
        print(f"📄 Data saved to: {filename}")
        
        # Ask if user wants to see all data
        show_all = input("\nWould you like to see all student data? (y/n): ").lower().startswith('y')
        if show_all:
            print("\n" + "="*50)
            print("ALL STUDENTS DATA:")
            print("="*50)
            for i, student in enumerate(students, 1):
                print(f"{i}. {student.name}")
                print(f"   College: {student.college}")
                print(f"   Degree: {student.degree}")
                print(f"   Graduation Year: {student.graduation_year}")
                print(f"   Location: {student.location}")
                print(f"   Headline: {student.headline}")
                print(f"   LinkedIn: {student.profile_url}")
                print(f"   Connections: {student.connections}")
                print(f"   Skills: {', '.join(student.skills) if student.skills else 'N/A'}")
                if student.experience:
                    exp = student.experience[0]
                    print(f"   Experience: {exp.get('title', 'N/A')} at {exp.get('company', 'N/A')}")
                print("-" * 40)
    else:
        print("❌ No students found!")
    
    print("\nDone! 🎉")

if __name__ == "__main__":
    search_students()