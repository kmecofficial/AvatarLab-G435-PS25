import os
import cv2
import glob
import subprocess
import shutil
from moviepy.editor import VideoFileClip, AudioFileClip
from tqdm import tqdm
import uuid
import tempfile

class DreamTalkIntegration:
    def __init__(self, base_path="Backendmodels"):
        self.base_path = base_path
        self.dreamtalk_path = os.path.join(base_path, "dreamtalk_main")
        self.real_esrgan_path = os.path.join(base_path, "Real-ESRGAN-master")
        self.codeformer_path = os.path.join(base_path, "CodeFormer-master")
        
        # Create necessary directories
        self.setup_directories()
    
    def setup_directories(self):
        """Create necessary directories for DreamTalk processing"""
        directories = [
            os.path.join(self.dreamtalk_path, "output_video"),
            os.path.join(self.dreamtalk_path, "output_video", "enhanced_frames"),
            os.path.join(self.dreamtalk_path, "output_video", "codeformer_frames"),
            os.path.join(self.dreamtalk_path, "output_video", "enhanced_frames", "final_results")
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def install_dependencies(self):
        """Install required dependencies for DreamTalk"""
        try:
            # Install basic dependencies
            subprocess.run(['pip', 'install', 'dlib'], check=True, capture_output=True)
            subprocess.run(['pip', 'install', 'av', '--quiet'], check=True, capture_output=True)
            subprocess.run(['pip', 'uninstall', '-y', 'scipy'], check=True, capture_output=True)
            subprocess.run(['pip', 'install', 'scipy==1.11.4'], check=True, capture_output=True)
            subprocess.run(['pip', 'install', 'yacs==0.1.8'], check=True, capture_output=True)
            subprocess.run(['pip', 'install', 'gradio', 'opencv-python', 'librosa', 'transformers'], check=True, capture_output=True)
            
            print("✓ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Error installing dependencies: {e}")
            return False
    
    def install_real_esrgan(self):
        """Install Real-ESRGAN for video enhancement"""
        try:
            if os.path.exists(self.real_esrgan_path):
                original_dir = os.getcwd()
                os.chdir(self.real_esrgan_path)
                subprocess.run(['pip', 'install', '-r', 'requirements.txt'], check=True, capture_output=True)
                subprocess.run(['python', 'setup.py', 'develop'], check=True, capture_output=True)
                os.chdir(original_dir)
                print("✓ Real-ESRGAN installed successfully")
                return True
            else:
                print("⚠ Real-ESRGAN path not found, skipping...")
                return False
        except subprocess.CalledProcessError as e:
            print(f"✗ Error installing Real-ESRGAN: {e}")
            return False
    
    def install_codeformer(self):
        """Install CodeFormer for face enhancement"""
        try:
            if os.path.exists(self.codeformer_path):
                original_dir = os.getcwd()
                os.chdir(self.codeformer_path)
                subprocess.run(['pip', 'install', '-r', 'requirements.txt'], check=True, capture_output=True)
                subprocess.run(['python', 'basicsr/setup.py', 'develop'], check=True, capture_output=True)
                subprocess.run(['pip', 'install', 'facexlib', 'gradio', 'insightface==0.7.3'], check=True, capture_output=True)
                subprocess.run(['pip', 'install', 'xformers==0.0.22', 'triton==2.0.0'], check=True, capture_output=True)
                os.chdir(original_dir)
                print("✓ CodeFormer installed successfully")
                return True
            else:
                print("⚠ CodeFormer path not available, skipping...")
                return False
        except subprocess.CalledProcessError as e:
            print(f"✗ Error installing CodeFormer: {e}")
            return False
    
    def generate_talking_head_video(self, image_path, audio_path, output_name):
        """Generate talking head video using DreamTalk"""
        try:
            # Set up paths
            style_clip_path = os.path.join(self.dreamtalk_path, "data", "style_clip", "3DMM", "W009_front_sad_level3_001.mat")
            pose_path = os.path.join(self.dreamtalk_path, "data", "pose", "RichardShelby_front_neutral_level1_001.mat")
            
            # Check if required files exist
            if not os.path.exists(style_clip_path):
                print(f"⚠ Style clip not found: {style_clip_path}")
                return False
            if not os.path.exists(pose_path):
                print(f"⚠ Pose file not found: {pose_path}")
                return False
            
            # Change to DreamTalk directory and run inference
            original_dir = os.getcwd()
            os.chdir(self.dreamtalk_path)
            
            cmd = [
                "python", "inference_for_demo_video.py",
                "--wav_path", audio_path,
                "--style_clip_path", style_clip_path,
                "--pose_path", pose_path,
                "--image_path", image_path,
                "--cfg_scale", "1.0",
                "--max_gen_len", "40",
                "--output_name", output_name
            ]
            
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            print("✓ Talking head video generated successfully")
            
            os.chdir(original_dir)
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"✗ Error generating talking head video: {e}")
            print(f"STDOUT: {e.stdout}")
            print(f"STDERR: {e.stderr}")
            return False
        except Exception as e:
            print(f"✗ Unexpected error in generate_talking_head_video: {e}")
            return False
    
    def extract_frames(self, video_path, output_dir):
        """Extract frames from video for enhancement"""
        try:
            # Clear previous frames
            if os.path.exists(output_dir):
                frame_files = glob.glob(os.path.join(output_dir, "frame_*.png"))
                for file in frame_files:
                    os.remove(file)
            else:
                os.makedirs(output_dir, exist_ok=True)
            
            # Extract frames
            vidcap = cv2.VideoCapture(video_path)
            success, image = vidcap.read()
            count = 0
            
            while success:
                cv2.imwrite(f"{output_dir}/frame_{count:05d}.png", image)
                success, image = vidcap.read()
                count += 1
            
            vidcap.release()
            print(f"✓ Extracted {count} frames")
            return True
            
        except Exception as e:
            print(f"✗ Error extracting frames: {e}")
            return False
    
    def enhance_frames_with_codeformer(self, input_dir, output_base):
        """Enhance frames using CodeFormer"""
        try:
            if not os.path.exists(self.codeformer_path):
                print("⚠ CodeFormer not available, skipping enhancement")
                return True
            
            # Clear previous enhanced frames
            final_results_dir = os.path.join(output_base, "final_results")
            if os.path.exists(final_results_dir):
                enhanced_files = glob.glob(os.path.join(final_results_dir, "frame_*.png"))
                for file in enhanced_files:
                    os.remove(file)
            
            # Run CodeFormer
            original_dir = os.getcwd()
            os.chdir(self.codeformer_path)
            
            cmd = [
                "python", "inference_codeformer.py",
                "-i", input_dir,
                "-o", output_base,
                "-w", "0.7",
                "--face_upsample",
                "--bg_upsampler", "realesrgan"
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            os.chdir(original_dir)
            print("✓ Frames enhanced with CodeFormer")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"✗ Error enhancing frames: {e}")
            return False
        except Exception as e:
            print(f"✗ Unexpected error in enhance_frames: {e}")
            return False
    
    def frames_to_video_with_audio(self, frames_dir, original_video, output_video):
        """Combine enhanced frames into final video with audio"""
        try:
            # Clear previous output
            if os.path.exists(output_video):
                os.remove(output_video)
            
            # Get frame files
            frame_files = sorted(glob.glob(f"{frames_dir}/frame_*.png"))
            if not frame_files:
                print("✗ No frame files found")
                return False
            
            # Get video properties
            frame = cv2.imread(frame_files[0])
            height, width, _ = frame.shape
            vidcap = cv2.VideoCapture(original_video)
            fps = vidcap.get(cv2.CAP_PROP_FPS)
            vidcap.release()
            
            # Create temporary video
            temp_video = "temp_video.mp4"
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(temp_video, fourcc, fps, (width, height))
            
            # Write frames
            for file in tqdm(frame_files, desc="Creating video"):
                img = cv2.imread(file)
                out.write(img)
            out.release()
            
            # Combine with audio
            video = VideoFileClip(temp_video)
            audio = VideoFileClip(original_video).audio
            video.set_audio(audio).write_videofile(output_video, codec='libx264')
            
            # Clean up
            os.remove(temp_video)
            print("✓ Final video created successfully")
            return True
            
        except Exception as e:
            print(f"✗ Error creating final video: {e}")
            return False
    
    def process_avatar(self, image_path, audio_path, output_video_path):
        """Main pipeline to process avatar generation"""
        try:
            # Generate unique output name
            output_name = f"avatar_{uuid.uuid4().hex[:8]}"
            
            # Step 1: Generate talking head video
            print("Step 1: Generating talking head video...")
            if not self.generate_talking_head_video(image_path, audio_path, output_name):
                return False
            
            # Get the generated video path
            dreamtalk_output = os.path.join(self.dreamtalk_path, "output_video", f"{output_name}.mp4")
            if not os.path.exists(dreamtalk_output):
                print(f"✗ DreamTalk output not found: {dreamtalk_output}")
                return False
            
            # Step 2: Extract frames
            print("Step 2: Extracting frames...")
            frames_dir = os.path.join(self.dreamtalk_path, "output_video", "codeformer_frames")
            if not self.extract_frames(dreamtalk_output, frames_dir):
                return False
            
            # Step 3: Enhance frames (optional)
            print("Step 3: Enhancing frames...")
            enhanced_base = os.path.join(self.dreamtalk_path, "output_video", "enhanced_frames")
            self.enhance_frames_with_codeformer(frames_dir, enhanced_base)
            
            # Step 4: Create final video
            print("Step 4: Creating final video...")
            enhanced_dir = os.path.join(enhanced_base, "final_results")
            
            # Use enhanced frames if available, otherwise use original frames
            if os.path.exists(enhanced_dir) and os.listdir(enhanced_dir):
                frames_to_use = enhanced_dir
            else:
                frames_to_use = frames_dir
            
            if not self.frames_to_video_with_audio(frames_to_use, dreamtalk_output, output_video_path):
                return False
            
            print("✓ Avatar generation completed successfully!")
            return True
            
        except Exception as e:
            print(f"✗ Error in process_avatar: {e}")
            return False

# Convenience function for easy integration
def generate_talking_avatar(image_path, audio_path, output_video_path):
    """Convenience function to generate talking avatar"""
    dreamtalk = DreamTalkIntegration()
    return dreamtalk.process_avatar(image_path, audio_path, output_video_path) 