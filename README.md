# Joram Cars

Kenya's Premier Used Car Marketplace - A full-stack web application for buying and selling quality used cars.

## Project Structure

```
joram-cars/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Config, database, security
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI app
│   ├── scripts/            # Utility scripts
│   ├── .env               # Environment variables
│   └── requirements.txt   # Python dependencies
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── context/       # React Context
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utilities
│   ├── .env              # Environment variables
│   └── package.json      # Node dependencies
│
└── start-dev.bat         # Development startup script
```

## Quick Start

### Option 1: Using Startup Script (Recommended)
Double-click `start-dev.bat` to start both servers automatically.

### Option 2: Manual Start

#### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:5173/admin

## Default Admin Credentials

- **Email**: admin@joramcars.co.ke
- **Password**: admin123

## Features

### Public Website
- [x] Home page with hero, featured vehicles, search
- [x] Vehicle listing with filters (make, body type, price, etc.)
- [x] Vehicle detail page with gallery and enquiry form
- [x] Sell your car multi-step form
- [x] About, Contact, FAQ pages
- [x] Newsletter subscription
- [x] WhatsApp integration

### Admin Dashboard
- [x] Dashboard with statistics
- [x] Vehicle management (CRUD + images)
- [x] Enquiries management
- [x] Sell requests management with valuation
- [x] JWT authentication

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy + SQLite (dev) / PostgreSQL (prod)
- JWT Authentication
- Pillow for image processing

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Framer Motion
- Lucide React Icons

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:///./joram_cars.db
SECRET_KEY=your-secret-key
ADMIN_EMAIL=admin@joramcars.co.ke
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WHATSAPP_NUMBER=254716770077
```
