#!/usr/bin/env python3
"""
Example Usage of LinkedIn Student Fetcher
Shows different ways to use the application
"""

from linkedin_student_fetcher import LinkedInStudentFetcher

def main():
    # Initialize the fetcher
    fetcher = LinkedInStudentFetcher()
    
    print("=== LinkedIn Student Data Fetcher Examples ===\n")
    
    # Example 1: Single college search
    print("1. Searching HKB College of Engineering...")
    hkb_students = fetcher.search_students_by_college("HKB College of Engineering", limit=5)
    print(f"   Found: {len(hkb_students)} students")
    
    # Example 2: Multiple colleges
    print("\n2. Searching multiple colleges...")
    colleges = [
        "HKB College of Engineering",
        "RV College of Engineering", 
        "BMS College of Engineering"
    ]
    
    all_results = fetcher.search_multiple_colleges(colleges, limit_per_college=3)
    total_students = sum(len(students) for students in all_results.values())
    print(f"   Total students found: {total_students}")
    
    # Example 3: Export in different formats
    print("\n3. Exporting data...")
    
    # Combine all students
    all_students = []
    for students in all_results.values():
        all_students.extend(students)
    
    # Export to JSON
    json_file = fetcher.export_to_json(all_students, "example_students.json")
    print(f"   JSON exported to: {json_file}")
    
    # Example 4: Filter by department
    print("\n4. Filtering by department...")
    cs_students = [s for s in all_students if 'Computer Science' in s.degree]
    mech_students = [s for s in all_students if 'Mechanical' in s.degree]
    
    print(f"   Computer Science students: {len(cs_students)}")
    print(f"   Mechanical Engineering students: {len(mech_students)}")
    
    # Example 5: Filter by graduation year
    print("\n5. Filtering by graduation year...")
    year_2024_students = [s for s in all_students if s.graduation_year == "2024"]
    year_2025_students = [s for s in all_students if s.graduation_year == "2025"]
    
    print(f"   2024 graduates: {len(year_2024_students)}")
    print(f"   2025 graduates: {len(year_2025_students)}")
    
    # Example 6: Display detailed info for first student
    if all_students:
        print(f"\n6. Sample student details:")
        student = all_students[0]
        print(f"   Name: {student.name}")
        print(f"   College: {student.college}")
        print(f"   Degree: {student.degree}")
        print(f"   Year: {student.graduation_year}")
        print(f"   Location: {student.location}")
        print(f"   Skills: {', '.join(student.skills)}")
        print(f"   LinkedIn: {student.profile_url}")
        print(f"   Connections: {student.connections}")
    
    print(f"\n✅ All examples completed!")
    print(f"📁 Check the current directory for exported files.")

if __name__ == "__main__":
    main()