from app.excel_db import append_response
import random
import os

def seed_data():
    categories = ["Student", "Job Seeker / Recent Graduate", "HR Professional / Recruiter", "Academic Administrator / Faculty", "Other"]
    for i in range(20):
        ans = {
            "Q1": random.choice(categories),
            "Q2": "I submit/provide credentials",
            "Q3": "Frequently",
            "Q4": ["Physical copies", "Scanned PDF documents"],
            "Q5": "1–2 days",
            "Q8": random.randint(1, 5),
            "Q10": random.randint(1, 5),
            "Q13": random.randint(1, 5),
            "Q14": random.choice(["Yes", "No", "Not sure"]),
            "Q17": random.choice(["Poor", "Average", "Good"]),
            "Q20": random.randint(3, 5),
            "Q21": random.choice(["Definitely yes", "Probably yes", "Not sure"]),
            "Q25": random.choice(["Definitely yes", "Probably yes", "Not sure", "Probably no", "Definitely no"]),
            "Q29": f"Demo problem {i}",
            "Q36": f"demo{i}@example.com" if random.choice([True, False]) else None
        }
        append_response(ans)
    print("Demo data generated successfully in data/responses.xlsx")

if __name__ == "__main__":
    seed_data()
