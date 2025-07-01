"Available Speakers: ['Claribel Dervla', 'Daisy Studious', 'Gracie Wise', 'Tammie Ema', 'Alison Dietlinde', 'Ana Florence', 'Annmarie Nele', 'Asya Anara', 'Brenda Stern', 'Gitta Nikolina', 'Henriette Usha', 'Sofia Hellen', 'Tammy Grit', 'Tanja Adelina', 'Vjollca Johnnie', 'Andrew Chipper', 'Badr Odhiambo', 'Dionisio Schuyler', 'Royston Min', 'Viktor Eka', 'Abrahan Mack', 'Adde Michal', 'Baldur Sanjin', 'Craig Gutsy', 'Damien Black', 'Gilberto Mathias', 'Ilkin Urbano', 'Kazuhiko Atallah', 'Ludvig Milivoj', 'Suad Qasim', 'Torcull Diarmuid', 'Viktor Menelaos', 'Zacharie Aimilios', 'Nova Hogarth', 'Maja Ruoho', 'Uta Obando', 'Lidiya Szekeres', 'Chandra MacFarland', 'Szofi Granger', 'Camilla Holmström', 'Lilya Stainthorpe', 'Zofija Kendrick', 'Narelle Moon', 'Barbora MacLean', 'Alexandra Hisakawa', 'Alma María', 'Rosemary Okafor', 'Ige Behringer', 'Filip Traverse', 'Damjan Chapman', 'Wulf Carlevaro', 'Aaron Dreschner', 'Kumar Dahl', 'Eugenio Mataracı', 'Ferran Simen', 'Xavier Hayasaka', 'Luis Moray', 'Marcos Rudaski']"
from flask import Flask,request,jsonify,send_from_directory
from TTS.api import TTS
import soundfile as sf
import os
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

model_path = r"C:\Users\Karthik\OneDrive\Desktop\PS22(Part2)\models\XTTS-v2" #providing model path
config_path = r"C:\Users\Karthik\OneDrive\Desktop\PS22(Part2)\models\XTTS-v2\config.json" #providing configs path
output_dir = r"C:\Users\Karthik\OneDrive\Desktop\PS22(Part2)\AudioFiles"
tts=TTS(model_path=model_path,config_path=config_path) #loading the TTS model

@app.route("/generate",methods=["POST"])
def generate_audio():
    try:
        text=request.form.get("text")
        gender = request.form.get("gender", "male")
    
        # speed=float(request.form.get("speed",1.0)) #can be excluded as the model doesnt use the speed option  
        speaker_map = {
                "male": "Damien Black",
                "female": "Claribel Dervla"
            }
        speaker = speaker_map.get(gender,"Damien Black")
        if not text:
            return jsonify({"error": "No text provided"}),400
    
        print(f"[INFO] Received text: {text}")
        print(f"[INFO] Selected speaker: {speaker}")
        wav = tts.tts(text=text, speaker=speaker, language="en")
        file_name = "output_audio.wav"
        full_path = os.path.join(output_dir, file_name)

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        sf.write(full_path, wav, samplerate=22050)
        print(f"[SUCCESS] Audio saved at: {full_path}")
        return jsonify({"audio_url": f"/audio/{file_name}"}), 200

    except Exception as e:
        print("[ERROR] An exception occurred during generation:")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    
@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_from_directory(output_dir,filename)
if __name__=="__main__":
    app.run(debug=True,port=5000)


#Below code snippet used for generating audio and saving it on my device before frontend integration
# text="Hi there im Damien Black, Welcome to the world of artificial intelligence, where technology meets creativity to redefine the boundaries of possibility. Artificial intelligence, or AI, is a branch of computer science that simulates human intelligence. It enables machines to perform tasks that typically require human cognition, such as learning, reasoning, problem-solving, and decision-making.Imagine a future where AI systems assist in everyday tasks, improve healthcare, and revolutionize education. Picture a classroom where every student learns at their own pace, guided by AI tutors that adapt to their individual needs. Envision a healthcare system where AI analyzes patient data in real-time to provide personalized treatment plans, improving outcomes and saving lives." # proving the text

# speaker='Damien Black' #selecting the speaker
# # emotion="happy"

# language="en" #languge setting

# wav=tts.tts(text=text,speaker=speaker,language=language) 

# '''Provinding with required directory and file location '''
# output_path=r"C:\Users\Karthik\OneDrive\Desktop\PS22(Part2)\AudioFiles"
# file_name="output_audio_file3.wav"
# full_path=f"{output_path}/{file_name}"


# sf.write(full_path, wav, samplerate=22050)   #saving the file at the path specified