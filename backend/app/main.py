from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from .models import SurveyResponse, LoginRequest
from .excel_db import append_response, get_all_responses, generate_summary_bytes, generate_excel_bytes
from .auth import verify_password, get_password_hash, create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
import os
from datetime import timedelta

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

def verify_token(req: Request):
    auth_header = req.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return payload

@app.post("/api/login")
def login(req: LoginRequest):
    if req.username != ADMIN_USER or req.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": req.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/submit")
@limiter.limit("5/minute")
def submit_survey(response: SurveyResponse, request: Request):
    if response.honey_pot:
        return {"status": "success"}
    
    if not response.answers.get("Q1"):
        raise HTTPException(status_code=400, detail="Q1 is required")
        
    append_response(response.answers)
    return {"status": "success"}

@app.get("/api/admin/responses", dependencies=[Depends(verify_token)])
def admin_responses():
    return get_all_responses()

@app.get("/api/admin/download", dependencies=[Depends(verify_token)])
def admin_download():
    excel_bytes = generate_excel_bytes()
    if excel_bytes:
        return Response(content=excel_bytes, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={'Content-Disposition': 'attachment; filename="responses.xlsx"'})
    raise HTTPException(status_code=404, detail="No data found")

@app.get("/api/admin/download-summary", dependencies=[Depends(verify_token)])
def admin_download_summary():
    excel_bytes = generate_summary_bytes()
    if excel_bytes:
        return Response(content=excel_bytes, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={'Content-Disposition': 'attachment; filename="summary.xlsx"'})
    raise HTTPException(status_code=404, detail="No data found")
