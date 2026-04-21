# RedoX - Medical Image Analysis Platform

RedoX is an AI-powered medical scan analysis web application. It allows users to upload medical images, processes them using Google Gemini AI models for analysis, and securely stores the scan reports in Firebase.

## 🚀 Features

- **User Authentication**: Secure Login/Registration powered by Firebase Auth.
- **Upload Scans**: Intuitive interface for uploading medical scans (X-ray, MRI, etc.).
- **AI Analysis**: Uses the Google Gemini API to analyze scans and generate diagnostic insights.
- **Reports Dashboard**: Stores user history and reports securely, accessible via a user-friendly dashboard.
- **Protected Routing**: Role-based routing to ensure user data privacy.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling/Animations**: [Framer Motion](https://www.framer.com/motion/) & Custom CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Auth/Storage**: Firebase Client SDK

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Engine**: Google GenAI (Gemini SDK)
- **Database/Auth**: Firebase Admin SDK (Firestore, Storage)
- **Server**: Uvicorn / Gunicorn

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher)
- A Firebase Project (with Firestore, Storage, and Authentication enabled)
- A Google Gemini API Key

---

### 1. Setting up the Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables:
   Create a `.env` file inside the `backend` directory referencing `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Fill in your `GEMINI_API_KEY`, `FIREBASE_STORAGE_BUCKET`, and add your `serviceAccountKey.json` from your Firebase project to the backend folder.*

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will run at `http://localhost:8000`. Test it by navigating to `http://localhost:8000/api/health`.

---

### 2. Setting up the Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file inside the `frontend` directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Fill with your Firebase config values and ensure `VITE_API_BASE_URL` points to your active backend (e.g., `http://localhost:8000/api`).*

4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open a Pull Request or create an Issue to suggest improvements, fix bugs, or add new features. Please ensure your code follows the established formatting and includes relevant clear commit messages.
