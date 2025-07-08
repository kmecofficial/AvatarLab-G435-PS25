// import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Navbar from './Navbar';

// const AvatarGenerator = () => {
//   const [text, setText] = useState('');
//   const [gender, setGender] = useState('male');
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const onDrop = useCallback((acceptedFiles) => {
//     const file = acceptedFiles[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onload = () => setPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png', '.webp']
//     },
//     multiple: false
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!text || !image) {
//       toast.error('Please enter text and upload an image');
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('text', text);
//     formData.append('gender', gender);
//     formData.append('image', image);

//     try {
//       const response = await axios.post('/api/generate_avatar', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         responseType: 'blob'
//       });

//       const videoBlob = new Blob([response.data], { type: 'video/mp4' });
//       const videoUrl = URL.createObjectURL(videoBlob);
//       setVideoUrl(videoUrl);
//       toast.success('Avatar generated successfully!');
//     } catch (error) {
//       toast.error('Failed to generate avatar');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container">
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
//           {/* Input Panel */}
//           <div className="panel">
//             <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
//               🎭 Avatar Generator
//             </h2>

//             <form onSubmit={handleSubmit}>
//               <div style={{ marginBottom: '25px' }}>
//                 <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
//                   📝 Script Content
//                 </label>
//                 <textarea
//                   value={text}
//                   onChange={(e) => setText(e.target.value)}
//                   className="input-field"
//                   style={{ minHeight: '120px', resize: 'vertical' }}
//                   placeholder="Enter your script here..."
//                   required
//                 />
//               </div>

//               <div style={{ marginBottom: '25px' }}>
//                 <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
//                   🖼️ Avatar Image
//                 </label>
//                 <div
//                   {...getRootProps()}
//                   style={{
//                     border: '3px dashed var(--accent-primary)',
//                     borderRadius: '20px',
//                     padding: '40px 20px',
//                     textAlign: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     background: isDragActive ? 'rgba(0, 255, 148, 0.05)' : 'rgba(0, 0, 0, 0.2)',
//                     borderColor: isDragActive ? 'var(--cyber-green)' : 'var(--accent-primary)'
//                   }}
//                 >
//                   <input {...getInputProps()} />
//                   {preview ? (
//                     <div>
//                       <img 
//                         src={preview} 
//                         alt="Preview" 
//                         style={{ 
//                           maxWidth: '200px', 
//                           maxHeight: '200px', 
//                           borderRadius: '50%',
//                           marginBottom: '15px'
//                         }} 
//                       />
//                       <p>Image uploaded successfully!</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📁</div>
//                       <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
//                         {isDragActive ? 'Drop your image here' : 'Drop your image here or click to browse'}
//                       </div>
//                       <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
//                         PNG, JPG, WEBP • Max 10MB • Square images recommended
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div style={{ marginBottom: '25px' }}>
//                 <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
//                   🎤 Voice Selection
//                 </label>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//                   <label style={{ cursor: 'pointer' }}>
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="male"
//                       checked={gender === 'male'}
//                       onChange={(e) => setGender(e.target.value)}
//                       style={{ display: 'none' }}
//                     />
//                     <div style={{
//                       padding: '20px 16px',
//                       background: gender === 'male' ? 'var(--gradient-primary)' : 'rgba(0, 0, 0, 0.3)',
//                       border: '2px solid',
//                       borderColor: gender === 'male' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
//                       borderRadius: '16px',
//                       textAlign: 'center',
//                       transition: 'all 0.3s ease',
//                       color: gender === 'male' ? 'white' : 'var(--text-primary)'
//                     }}>
//                       <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>👨</div>
//                       <div style={{ fontWeight: '600' }}>Male</div>
//                     </div>
//                   </label>

//                   <label style={{ cursor: 'pointer' }}>
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="female"
//                       checked={gender === 'female'}
//                       onChange={(e) => setGender(e.target.value)}
//                       style={{ display: 'none' }}
//                     />
//                     <div style={{
//                       padding: '20px 16px',
//                       background: gender === 'female' ? 'var(--gradient-primary)' : 'rgba(0, 0, 0, 0.3)',
//                       border: '2px solid',
//                       borderColor: gender === 'female' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
//                       borderRadius: '16px',
//                       textAlign: 'center',
//                       transition: 'all 0.3s ease',
//                       color: gender === 'female' ? 'white' : 'var(--text-primary)'
//                     }}>
//                       <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>👩</div>
//                       <div style={{ fontWeight: '600' }}>Female</div>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="btn"
//                 style={{ width: '100%', fontSize: '1.2rem', padding: '20px' }}
//                 disabled={loading}
//               >
//                 {loading ? '🎬 Generating Avatar...' : '✨ Generate Avatar Video'}
//               </button>
//             </form>
//           </div>

//           {/* Output Panel */}
//           <div className="panel">
//             <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
//               🎬 Live Preview
//             </h2>

//             {loading && (
//               <div className="loading">
//                 <div className="loading-dots">
//                   <div className="loading-dot"></div>
//                   <div className="loading-dot"></div>
//                   <div className="loading-dot"></div>
//                 </div>
//                 <p style={{ marginTop: '20px' }}>Generating your avatar...</p>
//               </div>
//             )}

//             {videoUrl && (
//               <div style={{ textAlign: 'center' }}>
//                 <video
//                   controls
//                   style={{
//                     width: '100%',
//                     maxWidth: '500px',
//                     borderRadius: '20px',
//                     boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
//                   }}
//                   src={videoUrl}
//                 >
//                   Your browser does not support the video tag.
//                 </video>
//                 <div style={{ marginTop: '20px' }}>
//                   <a 
//                     href={videoUrl} 
//                     download="avatar_video.mp4"
//                     className="btn btn-secondary"
//                   >
//                     📥 Download Video
//                   </a>
//                 </div>
//               </div>
//             )}

//             {!loading && !videoUrl && (
//               <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
//                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎭</div>
//                 <p>Generate an avatar to see the preview here</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvatarGenerator; 
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from './Navbar';

const AvatarGenerator = () => {
  const [text, setText] = useState('');
  const [gender, setGender] = useState('male');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const generateAudio = async () => {
    if (!text) {
      toast.error('Please enter text first');
      return;
    }

    setAudioLoading(true);
    const formData = new FormData();
    formData.append('text', text);
    formData.append('gender', gender);

    try {
      const response = await axios.post('http://localhost:5000/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.audio_url) {
        const audioUrl = `http://localhost:5000${response.data.audio_url}`;
        setAudioUrl(audioUrl);
        toast.success('Audio generated successfully!');
      } else {
        toast.error('Failed to generate audio');
      }
    } catch (error) {
      toast.error('Failed to generate audio');
      console.error(error);
    } finally {
      setAudioLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text || !image) {
      toast.error('Please enter text and upload an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);
    formData.append('gender', gender);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/generate_avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });

      const videoBlob = new Blob([response.data], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
      toast.success('Avatar generated successfully!');
    } catch (error) {
      toast.error('Failed to generate avatar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Input Panel */}
          <div className="panel">
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
              🎭 Avatar Generator
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
                  📝 Script Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="input-field"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Enter your script here..."
                  required
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
                  🖼️ Avatar Image
                </label>
                <div
                  {...getRootProps()}
                  style={{
                    border: '3px dashed var(--accent-primary)',
                    borderRadius: '20px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isDragActive ? 'rgba(0, 255, 148, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                    borderColor: isDragActive ? 'var(--cyber-green)' : 'var(--accent-primary)'
                  }}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div>
                      <img 
                        src={preview} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          borderRadius: '50%',
                          marginBottom: '15px'
                        }} 
                      />
                      <p>Image uploaded successfully!</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📁</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                        {isDragActive ? 'Drop your image here' : 'Drop your image here or click to browse'}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        PNG, JPG, WEBP • Max 10MB • Square images recommended
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
                  🎤 Voice Selection
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      padding: '20px 16px',
                      background: gender === 'male' ? 'var(--gradient-primary)' : 'rgba(0, 0, 0, 0.3)',
                      border: '2px solid',
                      borderColor: gender === 'male' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      color: gender === 'male' ? 'white' : 'var(--text-primary)'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>👨</div>
                      <div style={{ fontWeight: '600' }}>Male</div>
                    </div>
                  </label>

                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      padding: '20px 16px',
                      background: gender === 'female' ? 'var(--gradient-primary)' : 'rgba(0, 0, 0, 0.3)',
                      border: '2px solid',
                      borderColor: gender === 'female' ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      color: gender === 'female' ? 'white' : 'var(--text-primary)'
                    }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>👩</div>
                      <div style={{ fontWeight: '600' }}>Female</div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <button
                  type="button"
                  onClick={generateAudio}
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '1.1rem', padding: '16px', marginBottom: '15px' }}
                  disabled={audioLoading || !text}
                >
                  {audioLoading ? '🎵 Generating Audio...' : '🎵 Generate Audio Preview'}
                </button>

                <button
                  type="submit"
                  className="btn"
                  style={{ width: '100%', fontSize: '1.2rem', padding: '20px' }}
                  disabled={loading}
                >
                  {loading ? '🎬 Generating Avatar...' : '✨ Generate Avatar Video'}
                </button>
              </div>
            </form>
          </div>

          {/* Output Panel */}
          <div className="panel">
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
              🎬 Live Preview
            </h2>

            {/* Audio Preview Section */}
            {audioUrl && (
              <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '16px' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                  🔊 Audio Preview
                </h3>
                <audio
                  controls
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)'
                  }}
                  src={audioUrl}
                >
                  Your browser does not support the audio element.
                </audio>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <a 
                    href={audioUrl} 
                    download="generated_audio.wav"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                  >
                    📥 Download Audio
                  </a>
                </div>
              </div>
            )}

            {audioLoading && (
              <div className="loading" style={{ marginBottom: '30px' }}>
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <p style={{ marginTop: '20px' }}>Generating audio preview...</p>
              </div>
            )}

            {/* Video Preview Section */}
            {loading && (
              <div className="loading">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <p style={{ marginTop: '20px' }}>Generating your avatar...</p>
              </div>
            )}

            {videoUrl && (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                  🎬 Video Preview
                </h3>
                <video
                  controls
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}
                  src={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
                <div style={{ marginTop: '20px' }}>
                  <a 
                    href={videoUrl} 
                    download="avatar_video.mp4"
                    className="btn btn-secondary"
                  >
                    📥 Download Video
                  </a>
                </div>
              </div>
            )}

            {!loading && !videoUrl && !audioUrl && !audioLoading && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎭</div>
                <p>Generate audio or avatar to see the preview here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarGenerator;