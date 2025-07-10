from flask import Flask, request, jsonify, send_from_directory
from TTS.api import TTS
import os
import soundfile as sf
import os
from flask_cors import CORS

# Use relative paths for portability
model_path = os.path.join("models", "XTTS-v2")
config_path = os.path.join("models", "XTTS-v2", "config.json")
output_dir = os.path.join("static", "audio")

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load TTS model - handle missing model gracefully
try:
    tts = TTS(model_path=model_path, config_path=config_path)
    print(f"[INFO] TTS model loaded from: {model_path}")
except Exception as e:
    print(f"[WARNING] Could not load TTS model from {model_path}: {e}")
    print("[INFO] Will use default TTS model")
    tts = TTS()

def generate_audio_file(text, gender, output_path):
    """
    Generate audio from text using TTS model
    
    Args:
        text (str): Text to convert to speech
        gender (str): 'male' or 'female'
        output_path (str): Path where audio file will be saved
    """
    try:
        # Map gender to speaker
        speaker_map = {
            "male": "Damien Black",
            "female": "Sarah Johnson"
        }
        
        speaker = speaker_map.get(gender, "Damien Black")
        print(f"[INFO] Selected speaker: {speaker}")
        
        # Generate audio
        wav = tts.tts(text=text, speaker=speaker, language="en")
        
        # Save audio file
        sf.write(output_path, wav, tts.synthesizer.output_sample_rate)
        
        print(f"[INFO] Audio generated successfully: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"[ERROR] Failed to generate audio: {e}")
        raise e

@app.route("/generate", methods=["POST"])
def generate_audio():
    try:
        text = request.form.get("text")
        gender = request.form.get("gender", "male")
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # Generate audio file
        file_name = "output_audio.wav"
        full_path = os.path.join(output_dir, file_name)
        
        generate_audio_file(text, gender, full_path)
        
        print(f"[SUCCESS] Audio saved at: {full_path}")
        return jsonify({"audio_url": f"/audio/{file_name}"}), 200
        
    except Exception as e:
        print(f"[ERROR] Failed to generate audio: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_from_directory(output_dir, filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000) 