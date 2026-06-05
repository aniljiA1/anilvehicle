# 🚗 Vehicle Management System
**Visible Infotech — Full Stack Project**

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (No installation required!)

---

## 📁 Project Structure

```
vehicle-management/
├── backend/
│   ├── config/
│   │   ├── db.js          ← SQLite connection
│   │   └── initDB.js      ← Auto table + sample data
│   ├── routes/
│   │   └── vehicles.js    ← API endpoints
│   ├── database/
│   │   └── vehicles.db    ← Auto created on first run
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── vehicleAPI.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start (No SQL Server needed!)

### Step 1 — Backend
```bash
cd backend
npm install
npm run dev
```
Server starts at: **http://localhost:5000**
SQLite DB auto-creates at: `backend/database/vehicles.db`

### Step 2 — Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open browser: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| POST | `/api/vehicles` | Add new vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |

### POST / PUT Body
```json
{
  "vehicle_code": "VH001",
  "vehicle_no": "MH-12-AB-1234"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Vehicle added successfully!",
  "data": {
    "id": 1,
    "vehicle_code": "VH001",
    "vehicle_no": "MH-12-AB-1234",
    "created_at": "2026-06-04 10:00:00",
    "updated_at": "2026-06-04 10:00:00"
  }
}
```

---

## ✅ Features
- Add / Edit / Delete vehicles
- Duplicate vehicle code & number check
- Search / filter
- Form validation
- Toast notifications
- Responsive UI
- Visible Infotech branded theme
