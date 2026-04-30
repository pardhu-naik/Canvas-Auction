import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [artworks, setArtworks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks' or 'users'
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    if (activeTab === 'artworks') {
      fetchArtworks();
    } else {
      fetchUsers();
    }
  }, [user, navigate, activeTab]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/artworks?status=all`);
      setArtworks(data);
    } catch (error) {
      toast.error('Failed to fetch artworks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/auth/users`);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      try {
        await API.delete(`/artworks/${id}`);
        toast.success('Artwork deleted successfully');
        setArtworks(artworks.filter(art => art._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete artwork');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their data will be removed. This action cannot be undone.')) {
      try {
        await API.delete(`/auth/users/${id}`);
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredArtworks = artworks.filter(art => 
    art.title.toLowerCase().includes(search.toLowerCase()) || 
    (art.artist?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '40px', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary-light)' }}>Manage platform content and users</p>
      </motion.div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => { setActiveTab('artworks'); setSearch(''); }}
            style={{ 
              padding: '10px 20px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'artworks' ? '2px solid var(--primary-color)' : 'none',
              color: activeTab === 'artworks' ? 'var(--primary-color)' : 'inherit',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Artworks
          </button>
          <button 
            onClick={() => { setActiveTab('users'); setSearch(''); }}
            style={{ 
              padding: '10px 20px', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'users' ? '2px solid var(--primary-color)' : 'none',
              color: activeTab === 'users' ? 'var(--primary-color)' : 'inherit',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Users
          </button>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '15px', 
          padding: '15px 25px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <FiSearch style={{ color: 'var(--primary-color)' }} />
          <input 
            type="text" 
            placeholder={activeTab === 'artworks' ? "Search artworks..." : "Search users by name or email..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%', outline: 'none' }}
          />
        </div>

        <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
          {activeTab === 'artworks' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '20px' }}>Artwork</th>
                  <th style={{ padding: '20px' }}>Artist</th>
                  <th style={{ padding: '20px' }}>Price</th>
                  <th style={{ padding: '20px' }}>Status</th>
                  <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtworks.map((art) => (
                  <tr key={art._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img 
                        src={art.image} 
                        alt={art.title} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} 
                      />
                      <span style={{ fontWeight: 600 }}>{art.title}</span>
                    </td>
                    <td style={{ padding: '20px' }}>{art.artist?.name || 'Unknown'}</td>
                    <td style={{ padding: '20px' }}>${art.price}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        background: art.status === 'sold' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: art.status === 'sold' ? 'var(--error-color)' : 'var(--success-color)'
                      }}>
                        {art.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteArtwork(art._id)}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.1)', 
                          color: 'var(--error-color)', 
                          border: 'none', 
                          padding: '10px', 
                          borderRadius: '50%',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredArtworks.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>No artworks found.</td></tr>
                )}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '20px' }}>User</th>
                  <th style={{ padding: '20px' }}>Email</th>
                  <th style={{ padding: '20px' }}>Role</th>
                  <th style={{ padding: '20px' }}>Mobile</th>
                  <th style={{ padding: '20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '20px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '20px' }}>{u.email}</td>
                    <td style={{ padding: '20px' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: u.role === 'admin' ? 'var(--primary-color)' : 'inherit'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>{u.mobileNumber}</td>
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u.role === 'admin'}
                        style={{ 
                          background: u.role === 'admin' ? 'rgba(0,0,0,0.1)' : 'rgba(239, 68, 68, 0.1)', 
                          color: u.role === 'admin' ? '#555' : 'var(--error-color)', 
                          border: 'none', 
                          padding: '10px', 
                          borderRadius: '50%',
                          cursor: u.role === 'admin' ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
