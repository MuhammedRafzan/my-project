import os
import pandas as pd
from datetime import datetime
import uuid
import io
from .questions import QUESTIONS_META
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

Q_KEYS = [f"Q{i}" for i in range(1, 37)]

def append_response(answers: dict):
    if not supabase: 
        print("Warning: Supabase credentials not set. Data not saved.")
        return
        
    flat_answers = {}
    for q in Q_KEYS:
        col_name = f"{q}. {QUESTIONS_META.get(q, '')}" if q in QUESTIONS_META else q
        ans = answers.get(q)
        if isinstance(ans, list):
            flat_answers[col_name] = "; ".join(map(str, ans))
        elif ans is not None:
            flat_answers[col_name] = ans

    data = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now().isoformat(),
        "answers": flat_answers
    }
    supabase.table("responses").insert(data).execute()

def get_all_responses():
    if not supabase: 
        return []
    response = supabase.table("responses").select("*").execute()
    
    flattened = []
    for row in response.data:
        flat_row = {
            "Timestamp": row.get("created_at"),
            "Response ID": row.get("id")
        }
        flat_row.update(row.get("answers", {}))
        flattened.append(flat_row)
        
    return flattened

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
