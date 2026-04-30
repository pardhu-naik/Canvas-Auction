import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

import ArtworkCard from '../components/ArtworkCard';

const Wishlist = () => {
  const { user, wishlist, loading } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}><h2>Please login to view your wishlist.</h2><button className="btn btn-primary" onClick={() => navigate('/login')} style={{marginTop: '20px'}}>Login Now</button></div>;
  if (loading) return <Loader />;

  return (
    <div className="container" style={{paddingTop: '80px', paddingBottom: '100px', minHeight: '80vh'}}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '15px' }}>My <span className="gradient-text">Wishlist</span></h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary-light)' }}>Pieces that captured your heart. Ready to make them yours?</p>
        </div>
        
        {wishlist.length > 0 ? (
          <div className="artwork-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
            {wishlist.map((artwork) => (
              artwork && <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '80px 40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }}>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ marginBottom: '30px', display: 'inline-block' }}
            >
                <FiHeart size={80} style={{ color: 'var(--danger-color)', opacity: 0.3 }} />
            </motion.div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Your collection starts here</h3>
            <p style={{ color: 'var(--text-secondary-light)', fontSize: '1.1rem', marginBottom: '30px' }}>
              Explore the gallery and heart your favorite masterpieces to see them appear here.
            </p>
            <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }} onClick={() => navigate('/gallery')}>
              Explore Masterpieces
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;
