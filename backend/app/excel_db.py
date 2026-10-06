import os
import pandas as pd
from datetime import datetime
import uuid
import io
from .questions import QUESTIONS_META
import pymongo

MONGO_URI = os.getenv("MONGODB_URI")

client = pymongo.MongoClient(MONGO_URI) if MONGO_URI else None
db = client.get_database("vos_survey") if client else None
collection = db.get_collection("responses") if db else None

Q_KEYS = [f"Q{i}" for i in range(1, 37)]

def append_response(answers: dict):
    if collection is None: 
        print("Warning: MONGODB_URI not set. Data not saved.")
        return
        
    row = {
        "Timestamp": datetime.now().isoformat(),
        "Response ID": str(uuid.uuid4())
    }
    
    for q in Q_KEYS:
        col_name = f"{q}. {QUESTIONS_META.get(q, '')}" if q in QUESTIONS_META else q
        ans = answers.get(q)
        if isinstance(ans, list):
            row[col_name] = "; ".join(map(str, ans))
        elif ans is not None:
            row[col_name] = ans

    collection.insert_one(row)

def get_all_responses():
    if collection is None: 
        return []
    cursor = collection.find({}, {"_id": 0})
    return list(cursor)

def generate_excel_bytes():
    responses = get_all_responses()
    if not responses:
        return None
    df = pd.DataFrame(responses)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name="Responses", index=False)
    return output.getvalue()

def generate_summary_bytes():
    responses = get_all_responses()
    if not responses:
        return None
    df = pd.DataFrame(responses)
    summary_data = []
    for col in df.columns:
        if col in ["Timestamp", "Response ID", "_id"]:
            continue
        counts = df[col].value_counts()
        total = len(df[col].dropna())
        for val, count in counts.items():
            if pd.notnull(val):
                summary_data.append({
                    "Question": col,
                    "Answer": val,
                    "Count": count,
                    "Percentage": f"{(count / total * 100):.1f}%" if total > 0 else "0%"
                })
    
    summary_df = pd.DataFrame(summary_data)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name="Responses", index=False)
        summary_df.to_excel(writer, sheet_name="Summary", index=False)
    return output.getvalue()
