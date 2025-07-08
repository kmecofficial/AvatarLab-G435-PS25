

# AvatarGenerator

AvatarGenerator is a modern web application that brings images to life by generating talking avatar videos using advanced AI voice synthesis and lip-sync technology. The platform enables users to upload an image, input a script, and receive a video of the avatar speaking the provided text with realistic lip movements and natural-sounding speech.

## 🚀 Features
- **AI Voice Synthesis:** Converts text into natural, expressive speech.
- **Lip Sync Technology:** Synchronizes generated audio with avatar lip movements.
- **User Authentication:** Secure registration and login system.
- **Modern UI:** Responsive React-based frontend for seamless user experience.
- **Generation History:** Stores and displays user’s previous avatar generations.
- **Real-time Processing:** Fast, on-demand avatar video creation.

## 🏗️ Architecture
- **Frontend:** React (JavaScript) for user interface and interactions.
- **Backend:** Flask (Python) REST API for processing, authentication, and orchestration.
- **Database:** MongoDB for user data and generation history.
- **AI Models:** Integrates TTS (Text-to-Speech) and lip-sync models (e.g., DreamTalk, Wav2Lip).

```
new-avatar-project/
├── frontend/      # React app
├── backend/       # Flask API
├── models/        # TTS models (not included in repo)
├── Backendmodels/ # DreamTalk/Wav2Lip models (not included in repo)
├── static/        # Generated audio/video files
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)
- Pretrained AI models (see below)

### 1. Clone the Repository
```bash
# Clone the repository
git clone <your-repo-url>
cd new-avatar-project
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Model Setup
- Download or copy the required TTS and lip-sync models into `models/` and `Backendmodels/` directories.
- These are not included in the repository due to size.

### 5. Environment Variables
Create a `.env` file in the `backend/` directory:
```
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your-secret-key
DREAMTALK_PATH=/path/to/dreamtalk
```

### 6. Running the Application
- **Start MongoDB** (if running locally):
  ```bash
  mongod
  ```
- **Start Backend:**
  ```bash
  cd backend
  python app.py
  ```
- **Start Frontend:**
  ```bash
  cd frontend
  npm start
  ```

## 🌐 Usage
- Register or log in via the web interface.
- Upload an image and enter your script.
- Generate and preview/download your talking avatar video.
- View your generation history in the dashboard.

## 🔧 API Endpoints (Backend)
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login
- `POST /api/generate_avatar` — Generate avatar video
- `GET /api/history` — Get user’s generation history
- `GET /api/dashboard` — Get dashboard stats

## 📊 Database Schema (Example)
**Users Collection:**
```json
{
  "_id": "uuid",
  "email": "user@example.com",
  "password": "hashed_password",
  "created_at": "datetime"
}
```
**Generations Collection:**
```json
{
  "_id": "uuid",
  "user_id": "user_uuid",
  "text": "script text",
  "image_file": "filename.jpg",
  "audio_file": "filename.wav",
  "video_file": "filename.mp4",
  "created_at": "datetime",
  "status": "completed|processing|failed"
}
```

## 🔒 Security
- JWT-based authentication
- Password hashing (bcrypt)
- CORS and input validation

## 🚀 Deployment
- **Frontend:**
  ```bash
  cd frontend
  npm run build
  # Deploy the build/ folder to your static hosting
  ```
- **Backend:**
  ```bash
  cd backend
  gunicorn -w 4 -b 0.0.0.0:5001 app:app
  # Or use your preferred WSGI server
  ```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License
This project is licensed under the MIT License.

## 🆘 Support
For support, please open an issue in the repository or contact the development team.

---
**Happy Avatar Generating! 🎭✨** -->



<!-- <!--
# Previous README content commented out for reference

# Avatar Lab - AI Video Generator
A modern web application that generates talking avatar videos using AI voice synthesis and lip-sync technology.
... (previous content omitted for brevity) ...
-->
