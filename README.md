# Avatar Lab - AI Video Generator

A modern web application that generates talking avatar videos using AI voice synthesis and lip-sync technology.

## 🚀 Features

- **User Authentication** - Secure login/register system
- **AI Voice Synthesis** - Convert text to natural speech
- **Lip Sync Technology** - Synchronize audio with video
- **Modern React UI** - Beautiful, responsive interface
- **MongoDB Storage** - Store user data and generation history
- **Real-time Generation** - Create avatars instantly

## 🏗️ Architecture

```
new-avatar-project/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
├── backend/                  # Flask API
│   ├── app.py              # Main Flask application
│   ├── generate_audio.py   # TTS functionality
│   └── requirements.txt    # Python dependencies
├── models/                  # TTS models
├── Backendmodels/          # DreamTalk/Wav2Lip models
├── static/                  # Generated files
│   ├── audio/
│   └── video/
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud)
- DreamTalk model setup

### 1. Clone and Setup

```bash
# Navigate to your new project directory
cd new-avatar-project

# Copy your existing models
cp -r "../PS22(Part2)/models" .
cp -r "../PS22(Part2)/Backendmodels" .
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MONGODB_URI="mongodb://localhost:27017/"
export JWT_SECRET="your-secret-key"

# Run the backend
python app.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. MongoDB Setup

Install MongoDB locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend
```

## 📁 Project Structure

### Frontend Components

- **Login.js** - User authentication
- **Register.js** - User registration
- **Dashboard.js** - User dashboard with stats
- **AvatarGenerator.js** - Main avatar creation interface
- **History.js** - User generation history
- **Navbar.js** - Navigation component

### Backend API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/generate_avatar` - Generate avatar video
- `GET /api/history` - Get user generation history
- `GET /api/dashboard` - Get user dashboard stats

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your-secret-key-here
DREAMTALK_PATH=/path/to/dreamtalk
```

### DreamTalk Integration

1. Install DreamTalk model
2. Update paths in `backend/app.py`
3. Ensure all dependencies are installed

## 🎨 Features

### User Interface
- Modern, responsive design
- Dark theme with neon accents
- Drag & drop file upload
- Real-time preview
- Loading animations

### Backend Features
- JWT authentication
- MongoDB data persistence
- File upload handling
- Video generation pipeline
- Error handling

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy build folder to your hosting service
```

### Backend Deployment

```bash
cd backend
# Use gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Error handling

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: "uuid",
  email: "user@example.com",
  password: "hashed_password",
  created_at: "datetime"
}
```

### Generations Collection
```javascript
{
  _id: "uuid",
  user_id: "user_uuid",
  text: "script text",
  gender: "male|female",
  image_file: "filename.jpg",
  audio_file: "filename.wav",
  video_file: "filename.mp4",
  created_at: "datetime",
  status: "completed|processing|failed"
}
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

**Happy Avatar Generating! 🎭✨** 