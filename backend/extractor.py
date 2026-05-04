import re

def extract_fields(text):
    result = {}

    # Extract Roll No (6-8 digit number)
    roll = re.search(r'Roll\s*No\s*[:\-]?\s*(\d{6,8})', text, re.IGNORECASE)
    if roll:
        result["roll_no"] = roll.group(1)

    # Extract Student No (handles Studeut, Student, Stud etc)
    student = re.search(r'Stude\w*\s*No\s*[:\-]?\s*(\d{9,10})', text, re.IGNORECASE)
    if student:
        result["student_no"] = student.group(1)

    # Extract Name (looks for name before ourse or Branch)
    name = re.search(r'([A-Z]+\s+[A-Z]+)\s+(?:ourse|Course|Branch)', text, re.IGNORECASE)
    if name:
        result["name"] = name.group(1).title()

    # Extract Branch
    branch = re.search(r'Branch\s*[:\-]?\s*([A-Z]+)', text, re.IGNORECASE)
    if branch:
        result["branch"] = branch.group(1)

    # Extract Course (handles ourse, Course etc)
    course = re.search(r'[Cc]?ourse\s*[:\-]?\s*([A-Z\.]+)', text, re.IGNORECASE)
    if course:
        result["course"] = course.group(1)

    return result