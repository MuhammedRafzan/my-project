# CredenSync VoS Survey App

This is a complete, runnable web application for the CredenSync Voice of Stakeholder (VoS) Survey. 

## Features
- **Public Survey Form**: Responsive, section-by-section layout with progress bar, honeypot bot protection, and a short-version toggle.
- **Excel Storage**: Responses are stored directly into `data/responses.xlsx` locally, with file locking for safe concurrent writes. No SQL/NoSQL DB required.
- **Admin Dashboard**: Protected by JWT login. Includes KPI cards, Recharts visualizations, and an open-ended answers search panel.

## Folder Structure
```
/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py           # FastAPI routes & config
│   │   ├── models.py         # Pydantic data models
│   │   ├── excel_db.py       # Excel logic with pandas & openpyxl
│   │   ├── auth.py           # JWT Authentication
│   │   └── questions.py      # Question metadata definitions
│   ├── seed.py               # Generates 20 mock survey responses
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Secrets and credentials
├── frontend/                 # React (Vite) Frontend
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind styling config
│   ├── src/
│   │   ├── App.jsx           # Main routing configuration
│   │   ├── survey_config.js  # The full 35-question configurations
│   │   └── components/
│   │       ├── SurveyForm.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── Login.jsx
│   └── ...
└── data/                     # Created automatically to store the Excel file
```

## Running Locally

### 1. Backend Setup
Open a terminal and navigate to the `backend` folder:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt

# (Optional) Seed the database with demo data:
python seed.py

# Run the backend server
uvicorn app.main:app --reload
```
*The backend API will run on http://localhost:8000.*

### 2. Frontend Setup
Open a new terminal and navigate to the `frontend` folder:
```bash
cd frontend
npm install

# Run the frontend development server
npm run dev
```
*The frontend UI will be available at http://localhost:5173.*

### Admin Login
Navigate to `http://localhost:5173/login` in your browser.
By default, the credentials (configured in `backend/.env`) are:
- **Username**: `admin`
- **Password**: `admin`

## Deployment Instructions (Railway, Render, etc.)

Because this app relies on the local filesystem (`data/responses.xlsx`) for storage rather than a cloud database, deploying to a stateless container service will result in data loss on restart unless you attach a **Persistent Volume / Disk**.

### Option 1: Railway (Recommended)
1. Push this repository to GitHub.
2. In Railway, create a new project and deploy the repository.
3. Deploy the backend and frontend as two separate services.
4. **Backend Setup**: 
   - Add a **Persistent Volume** in the service settings. Mount it to `/app/data` (depending on your Docker WORKDIR).
   - Add your Environment Variables (`ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET`).
5. **Frontend Setup**: 
   - Ensure the API URL in `SurveyForm.jsx` and `AdminDashboard.jsx` is updated from `http://localhost:8000` to your Railway backend URL (or pass it via Vite environment variables).

### Option 2: Render
1. Deploy the Backend as a "Web Service". 
2. Add a "Disk" to the service under advanced settings and mount it to the `data/` folder to persist the Excel file.
3. Deploy the Frontend as a "Static Site", defining the build command (`npm run build`) and publish directory (`dist`).

**Important Warning:** Never expose the `backend/app/auth.py` or `jwt_secret` keys to public repositories. Change the `.env` values before production deployment.
