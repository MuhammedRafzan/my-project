import os
import pandas as pd
from filelock import FileLock
from datetime import datetime
import uuid
from .questions import QUESTIONS_META

DATA_DIR = "../data"
EXCEL_FILE = os.path.join(DATA_DIR, "responses.xlsx")
LOCK_FILE = os.path.join(DATA_DIR, "responses.xlsx.lock")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

Q_KEYS = [f"Q{i}" for i in range(1, 37)]

def get_db_lock():
    return FileLock(LOCK_FILE)

def init_db():
    with get_db_lock():
        if not os.path.exists(EXCEL_FILE):
            cols = ["Timestamp", "Response ID"]
            for q in Q_KEYS:
                if q in QUESTIONS_META:
                    cols.append(f"{q}. {QUESTIONS_META[q]}")
                else:
                    cols.append(q)
            df = pd.DataFrame(columns=cols)
            with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name="Responses", index=False)

def append_response(answers: dict):
    with get_db_lock():
        if not os.path.exists(EXCEL_FILE):
            init_db()
            
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

        df = pd.DataFrame([row])
        
        with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
            startrow = writer.sheets["Responses"].max_row
            df.to_excel(writer, sheet_name="Responses", startrow=startrow, header=False, index=False)

def get_all_responses():
    with get_db_lock():
        if not os.path.exists(EXCEL_FILE):
            return []
        df = pd.read_excel(EXCEL_FILE, sheet_name="Responses")
        df = df.astype(object).where(pd.notnull(df), None)
        return df.to_dict(orient="records")

def generate_summary():
    with get_db_lock():
        if not os.path.exists(EXCEL_FILE):
            return None
        df = pd.read_excel(EXCEL_FILE, sheet_name="Responses")
        summary_data = []
        for col in df.columns:
            if col in ["Timestamp", "Response ID"]:
                continue
            counts = df[col].value_counts()
            total = len(df[col].dropna())
            for val, count in counts.items():
                if pd.notnull(val):
                    # split if it contains "; "
                    if isinstance(val, str) and "; " in val:
                        # this is a simplification for the summary sheet
                        pass
                    summary_data.append({
                        "Question": col,
                        "Answer": val,
                        "Count": count,
                        "Percentage": f"{(count / total * 100):.1f}%" if total > 0 else "0%"
                    })
        
        summary_df = pd.DataFrame(summary_data)
        temp_file = os.path.join(DATA_DIR, "summary_temp.xlsx")
        
        with pd.ExcelWriter(temp_file, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name="Responses", index=False)
            summary_df.to_excel(writer, sheet_name="Summary", index=False)
            
        return temp_file
