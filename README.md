# AgriAdvisor AI — Precision Localized Crop Advisory & Farming Assistant

AgriAdvisor AI is an enterprise-ready, production-grade agronomic advisory platform designed for smallholder farmers, agronomists, and agricultural extension workers. Powered by **Google Gemini 2.5 Flash** (via `@google/genai`) and **Supabase PostgreSQL with Row Level Security (RLS)**.

---

## 🌟 Key Features

1. **Multimodal Visual Crop Health Inspector:**
   - Real-time leaf disease detection using Gemini 2.5 Multimodal Vision.
   - Outputs severity score, diagnostic confidence percentage, visible pathological symptoms, and split organic/chemical remedies.
   - Built-in 1-click curated test specimens (Tomato Blight, Corn Rust, Citrus Canker) with canvas image compression.

2. **Smart Field & Soil Advisory Engine:**
   - Ingests soil texture (Clay, Loamy, Sandy, Silt, Peaty, Chalky, Saline), electrochemical pH, and N-P-K nutrient status.
   - Multi-step interactive wizard with presets for Midwest Corn, Salinas Valley Tomatoes, and Kansas Wheat.
   - Produces structured, scientific, and localized advisory plans.

3. **Dynamic Fertilizer & Irrigation Planner:**
   - Day-by-day and week-by-week actionable tasks tailored to crop phenology (Germination, Vegetative, Flowering, Harvest).
   - Irrigation volume calculation (litres/acre) with critical flowering stage flood warnings.

4. **Yield Prediction & Regional Market Trends:**
   - Recharts visual comparisons between traditional farming, AI-optimized schedules, and peak tech potential.
   - Terminal mandi wholesale price forecasts and optimal harvest timing windows.

5. **Farmer Profile & Registered Plots:**
   - Acreage telemetry management with unit conversion (acres / hectares) and soil history tracking.

---

## 🏗️ Architecture & Security Standard

- **Clean Decoupled Architecture:** Strict separation between React 18 client and Node.js/Express backend.
- **Server-Side AI Confidentiality:** `GEMINI_API_KEY` is strictly held on the Express server and never exposed to the browser client.
- **Supabase PostgreSQL & RLS:** All tables (`profiles`, `fields`, `advisory_reports`, `disease_inspections`) enforce Row Level Security ensuring tenant isolation.
- **Strict Validation:** Runtime schema validation with Zod on both client forms and incoming Express payloads.
- **Rate Limiting & Protection:** Helmet security headers, CORS origin domain whitelisting, and Express rate limiting (max 20 AI advisory generations per hour).

---

## 📁 Repository Structure

```
agri-advisor-app/
├── client/                      # React 18 + Vite Frontend
│   ├── public/
│   │   └── leaf.svg             # Application Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdvisoryForm.jsx        # Multi-step agronomic wizard
│   │   │   ├── AdvisoryReportView.jsx  # Render engine with Print/PDF action
│   │   │   ├── DiseaseCard.jsx         # Disease severity & remedies card
│   │   │   ├── ImageUploader.jsx       # Drag & drop photo upload + sample gallery
│   │   │   ├── Navbar.jsx              # Responsive navigation & session controls
│   │   │   ├── ScheduleTimeline.jsx    # Interactive fertilizer/irrigation timeline
│   │   │   ├── Sidebar.jsx             # Dashboard sidebar & micro-climate widgets
│   │   │   ├── StatCard.jsx            # Metric summary display
│   │   │   └── YieldChart.jsx          # Recharts comparative yield scenarios
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Supabase Auth + 1-Click Demo Mode
│   │   ├── pages/
│   │   │   ├── AdvisoryDetailsPage.jsx # Full single report viewer
│   │   │   ├── AuthPage.jsx            # Sign in / Register with Supabase
│   │   │   ├── DashboardPage.jsx       # Overview, alerts, recent logs
│   │   │   ├── LandingPage.jsx         # High-converting product showcase
│   │   │   ├── MarketInsightsPage.jsx  # Regional price forecast & harvest timing
│   │   │   ├── NewAdvisoryPage.jsx     # Advisory wizard page
│   │   │   ├── ProfilePage.jsx         # Field manager & profile settings
│   │   │   └── VisualInspectorPage.jsx # Multimodal plant health inspector
│   │   ├── services/
│   │   │   ├── api.js                  # Typed backend API client
│   │   │   └── supabaseClient.js       # Supabase client SDK
│   │   ├── App.jsx                     # Route hierarchy & protected layout
│   │   ├── main.jsx                    # React root
│   │   └── index.css                   # Tailwind tokens, glassmorphism & print CSS
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Node.js + Express Backend
│   ├── config/
│   │   ├── gemini.js            # @google/genai SDK setup (gemini-2.5-flash)
│   │   └── supabaseAdmin.js     # Supabase admin client
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT bearer validation
│   │   └── errorHandler.js      # Global Zod & error handler
│   ├── routes/
│   │   ├── advisoryRoutes.js    # /api/v1/advisory
│   │   ├── inspectorRoutes.js   # /api/v1/inspector
│   │   ├── marketRoutes.js      # /api/v1/market
│   │   └── historyRoutes.js     # /api/v1/history
│   ├── services/
│   │   ├── geminiService.js     # Structured AI prompts & multimodal vision
│   │   └── databaseService.js   # Supabase DB operations with zero-crash fallback
│   ├── validators/
│   │   └── advisoryValidator.js # Zod schemas
│   ├── .env                     # Server environment variables
│   ├── index.js                 # Express server entrypoint
│   └── package.json
├── database/
│   └── schema.sql               # PostgreSQL schema & RLS policies for Supabase
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Supabase PostgreSQL)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and open the **SQL Editor**.
2. Run the SQL script located in `database/schema.sql`.
   This creates all 4 tables (`profiles`, `fields`, `advisory_reports`, `disease_inspections`), foreign keys, triggers, and Row Level Security policies.

### 2. Configure Environment Variables
Copy and populate `.env` files:

**`server/.env`:**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
```

**`client/.env`:**
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **Note on Zero-Downtime Exploration:** If you run AgriAdvisor AI without setting live API keys immediately, the platform automatically activates its **Zero-Downtime Agronomic Simulation Engine**. You can click **"Quick Demo Access"** on the landing page to test all advisory workflows, multimodal leaf diagnostics, and market forecasts instantly!

### 3. Run the Backend API
```bash
cd server
npm start
```
API runs on `http://localhost:5000`. Health check available at `http://localhost:5000/api/health`.

### 4. Run the Frontend Web Application
```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your web browser.

---

## 🔒 Security & Verification Checks

- **Zero Client Key Exposure:** Gemini SDK is initialized only in `server/config/gemini.js`.
- **JWT Authorization:** Express routes validate `Authorization: Bearer <token>` through Supabase Auth.
- **Production Build:** `npm run build` in `client` passes with zero errors and generates minified assets.
