from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import os
import uuid
import datetime
from functools import wraps
from dotenv import load_dotenv
import subprocess
from generate_audio import generate_audio_file
# Google Drive paths - use relative paths for cross-platform compatibility
GOOGLE_DRIVE_BASE = r"G:\My Drive"
GOOGLE_DRIVE_IMAGE_DIR = os.path.join(GOOGLE_DRIVE_BASE, "dreamtalk_main", "data", "src_img", "uncropped")
GOOGLE_DRIVE_AUDIO_DIR = os.path.join(GOOGLE_DRIVE_BASE, "dreamtalk_main", "data", "audio")
GOOGLE_DRIVE_VIDEO_DIR = os.path.join(GOOGLE_DRIVE_BASE, "dreamtalk_main", "output_video")

# Create directories
for directory in [GOOGLE_DRIVE_IMAGE_DIR, GOOGLE_DRIVE_AUDIO_DIR, GOOGLE_DRIVE_VIDEO_DIR]:
    os.makedirs(directory, exist_ok=True)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['avatar_generator']
users_collection = db['users']
generations_collection = db['generations']

# JWT secret
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')

# Directory setup
audio_dir = os.path.join("static", "audio")
video_dir = os.path.join("static", "video")
dreamtalk_dir = os.path.join("Backendmodels", "dreamtalk_main")

for directory in [audio_dir, video_dir]:
    if not os.path.exists(directory):
        os.makedirs(directory)

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer '
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = users_collection.find_one({'_id': data['user_id']})
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
        except:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            '_id': str(uuid.uuid4()),
            'email': email,
            'password': hashed_password,
            'created_at': datetime.datetime.utcnow()
        }
        
        users_collection.insert_one(user)
        
        # Generate token
        token = jwt.encode(
            {'user_id': user['_id'], 'email': user['email']},
            JWT_SECRET,
            algorithm='HS256'
        )
        
        return jsonify({
            'token': token,
            'user': {'email': user['email'], 'id': user['_id']}
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode(
            {'user_id': user['_id'], 'email': user['email']},
            JWT_SECRET,
            algorithm='HS256'
        )
        
        return jsonify({
            'token': token,
            'user': {'email': user['email'], 'id': user['_id']}
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Avatar generation route
@app.route('/api/generate_avatar', methods=['POST'])
@token_required
def generate_avatar(current_user):
    try:
        # Get inputs
        text = request.form.get('text')
        gender = request.form.get('gender', 'male')
        image = request.files.get('image')
        
        if not text or not image:
            return jsonify({'message': 'Text and image are required'}), 400
        
        # Generate unique filenames
        uid = str(uuid.uuid4())
        image_path = os.path.join(GOOGLE_DRIVE_IMAGE_DIR, f"{uid}.jpg")
        audio_path = os.path.join(GOOGLE_DRIVE_AUDIO_DIR, f"{uid}.wav")
        output_name = f"avatar_{uid}"
        video_path = os.path.join(video_dir, f"{uid}_output.mp4")
        
        # Save image
        image.save(image_path)
        print(f"Saving image to: {image_path}")
        
        # Generate audio
        generate_audio_file(text, gender, audio_path)
        
        # Files are now in Google Drive, Colab will process them
        print(f"[INFO] Files saved to Google Drive:")
        print(f"[INFO] Image: {image_path}")
        print(f"[INFO] Audio: {audio_path}")
        print(f"[INFO] Job ID: {uid}")
        print(f"[INFO] Colab will process this job automatically")
        
        # Save generation record to MongoDB
        generation_record = {
            '_id': uid,
            'user_id': current_user['_id'],
            'text': text,
            'gender': gender,
            'image_file': f"{uid}_input.jpg",
            'audio_file': f"{uid}_output.wav",
            'video_file': f"{uid}_output.mp4",
            'created_at': datetime.datetime.utcnow(),
            'status': 'processing'  # Changed from 'completed' to 'processing'
        }
        
        generations_collection.insert_one(generation_record)
        
        # Return job ID for frontend to poll
        return jsonify({
            'message': 'Job submitted successfully',
            'job_id': uid,
            'status': 'processing'
        }), 202
        
    except Exception as e:
        print(f"Error in generate_avatar: {e}")
        return jsonify({'message': 'Internal server error'}), 500

# History route
@app.route('/api/history', methods=['GET'])
@token_required
def get_history(current_user):
    try:
        generations = list(generations_collection.find(
            {'user_id': current_user['_id']},
            {'_id': 1, 'text': 1, 'gender': 1, 'created_at': 1, 'status': 1}
        ).sort('created_at', -1))
        
        # Convert ObjectId to string for JSON serialization
        for gen in generations:
            gen['_id'] = str(gen['_id'])
            gen['created_at'] = gen['created_at'].isoformat()
        
        return jsonify(generations), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Dashboard stats
@app.route('/api/dashboard', methods=['GET'])
@token_required
def get_dashboard(current_user):
    try:
        total_generations = generations_collection.count_documents({'user_id': current_user['_id']})
        recent_generations = list(generations_collection.find(
            {'user_id': current_user['_id']},
            {'_id': 1, 'text': 1, 'created_at': 1}
        ).sort('created_at', -1).limit(5))
        
        for gen in recent_generations:
            gen['_id'] = str(gen['_id'])
            gen['created_at'] = gen['created_at'].isoformat()
        
        return jsonify({
            'total_generations': total_generations,
            'recent_generations': recent_generations
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Job status and video serving endpoints
@app.route('/api/job/<job_id>/status', methods=['GET'])
@token_required
def get_job_status(current_user, job_id):
    try:
        # Check if video exists in Google Drive output directory
        output_video_path = os.path.join(GOOGLE_DRIVE_VIDEO_DIR, f"{job_id}.mp4")
        
        if os.path.exists(output_video_path):
            return jsonify({
                'status': 'completed',
                'video_path': output_video_path
            }), 200
        else:
            return jsonify({
                'status': 'processing'
            }), 200
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/video/<job_id>', methods=['GET'])
@token_required
def serve_video(current_user, job_id):
    try:
        # Video path in Google Drive
        video_path = os.path.join(GOOGLE_DRIVE_VIDEO_DIR, f"{job_id}.mp4")
        
        if os.path.exists(video_path):
            return send_file(video_path, mimetype='video/mp4')
        else:
            return jsonify({'message': 'Video not found'}), 404
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Add missing endpoints for frontend
@app.route('/api/download/<job_id>', methods=['GET'])
@token_required
def download_video(current_user, job_id):
    try:
        video_path = os.path.join(GOOGLE_DRIVE_VIDEO_DIR, f"{job_id}.mp4")
        
        if os.path.exists(video_path):
            return send_file(video_path, mimetype='video/mp4', as_attachment=True, download_name=f"avatar_{job_id}.mp4")
        else:
            return jsonify({'message': 'Video not found'}), 404
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/stream/<job_id>', methods=['GET'])
@token_required
def stream_video(current_user, job_id):
    try:
        video_path = os.path.join(GOOGLE_DRIVE_VIDEO_DIR, f"{job_id}.mp4")
        
        if os.path.exists(video_path):
            return send_file(video_path, mimetype='video/mp4')
        else:
            return jsonify({'message': 'Video not found'}), 404
            
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Update job status when Colab completes processing
@app.route('/api/job/<job_id>/complete', methods=['POST'])
def complete_job(job_id):
    try:
        # Update the generation record status to completed
        generations_collection.update_one(
            {'_id': job_id},
            {'$set': {'status': 'completed'}}
        )
        
        return jsonify({'message': 'Job status updated to completed'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 