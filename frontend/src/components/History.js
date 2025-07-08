import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const History = () => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGenerations(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '3rem' }}>
          📚 Generation History
        </h1>

        {generations.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
            <h2 style={{ marginBottom: '15px' }}>No Generations Yet</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Start creating avatars to see them here
            </p>
            <a href="/generate" className="btn">
              🎭 Create Your First Avatar
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {generations.map((gen) => (
              <div key={gen._id} className="panel">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '1.5rem' }}>
                        {gen.gender === 'male' ? '👨' : '👩'}
                      </div>
                      <div>
                        <h3 style={{ marginBottom: '5px' }}>
                          {gen.text.length > 100 ? `${gen.text.substring(0, 100)}...` : gen.text}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          Created on {formatDate(gen.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: 'var(--gradient-primary)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        color: 'white'
                      }}>
                        {gen.gender === 'male' ? 'Male Voice' : 'Female Voice'}
                      </span>
                      <span style={{
                        padding: '4px 12px',
                        background: 'rgba(0, 255, 148, 0.2)',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        color: 'var(--cyber-green)',
                        border: '1px solid var(--cyber-green)'
                      }}>
                        {gen.status}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      onClick={() => {
                        // Download video functionality
                        const videoUrl = `/api/download/${gen._id}`;
                        const link = document.createElement('a');
                        link.href = videoUrl;
                        link.download = `avatar_${gen._id}.mp4`;
                        link.click();
                      }}
                    >
                      📥 Download
                    </button>
                    <button 
                      className="btn"
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      onClick={() => {
                        // View video functionality
                        window.open(`/api/stream/${gen._id}`, '_blank');
                      }}
                    >
                      ▶️ Play
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {generations.length > 0 && (
          <div className="panel" style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Total Generations: <strong>{generations.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 