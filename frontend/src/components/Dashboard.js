import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
          🎭 Welcome to Avatar Lab
        </h1>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="panel">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎬</div>
              <h3 style={{ marginBottom: '10px' }}>Total Generations</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                {stats?.total_generations || 0}
              </div>
            </div>
          </div>

          <div className="panel">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚡</div>
              <h3 style={{ marginBottom: '10px' }}>Ready to Create</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Start generating amazing avatars
              </p>
            </div>
          </div>

          <div className="panel">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📚</div>
              <h3 style={{ marginBottom: '10px' }}>Your History</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                View all your creations
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="panel">
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
            🚀 Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <Link to="/generate" className="btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span>🎭</span>
              Create New Avatar
            </Link>
            
            <Link to="/history" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span>📚</span>
              View History
            </Link>
          </div>
        </div>

        {/* Recent Generations */}
        {stats?.recent_generations?.length > 0 && (
          <div className="panel">
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>
              📝 Recent Generations
            </h2>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              {stats.recent_generations.map((gen) => (
                <div 
                  key={gen._id}
                  style={{
                    padding: '15px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '5px' }}>
                        {gen.text.length > 50 ? `${gen.text.substring(0, 50)}...` : gen.text}
                      </p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {new Date(gen.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>
                      {gen.gender === 'male' ? '👨' : '👩'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="panel">
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', textAlign: 'center' }}>
            ✨ Features
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎤</div>
              <h3 style={{ marginBottom: '10px' }}>AI Voice Synthesis</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Generate natural-sounding speech from text
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🎬</div>
              <h3 style={{ marginBottom: '10px' }}>Lip Sync</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Perfect synchronization between audio and video
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>📱</div>
              <h3 style={{ marginBottom: '10px' }}>Easy Upload</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Drag and drop your images for quick processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 