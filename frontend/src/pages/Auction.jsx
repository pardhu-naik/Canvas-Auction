import React, { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import API from '../services/api';
import Loader from '../components/Loader';
import { FiClock, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/gallery.css';

const Auction = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionArtworks = async () => {
      try {
        const { data } = await API.get('/artworks?status=auction');
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching auction artworks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionArtworks();
  }, []);

  return (
    <div className="gallery-page container" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <div className="gallery-header" style={{ marginBottom: '60px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{ fontSize: '3.5rem', marginBottom: '15px' }}>Live <span className="gradient-text">Auctions</span></h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Discover exclusive pieces currently up for bidding. Witness the thrill of the auction in real-time.</p>
        </motion.div>
      </div>

      <motion.div 
        className="auction-stats-bar glass-card" 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          marginBottom: '80px', 
          display: 'flex', 
          justifyContent: 'center',
          gap: '60px', 
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--primary-glow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiActivity style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
            </div>
            <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Drops</span>
                <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>{artworks.length}</p>
            </div>
        </div>
        <div style={{ width: '1px', background: 'var(--border-color)', height: '40px', alignSelf: 'center' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiClock style={{ color: 'var(--secondary-color)', fontSize: '1.5rem' }} />
            </div>
            <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Bidders</span>
                <p style={{ fontWeight: 900, fontSize: '1.5rem' }}>4,829</p>
            </div>
        </div>
      </motion.div>

      {loading ? (
        <Loader />
      ) : (
        <div className="artwork-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
          {artworks.length > 0 ? (
            artworks.map((art, index) => (
              <motion.div
                key={art._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ArtworkCard artwork={art} />
              </motion.div>
            ))
          ) : (
            <div className="no-results">
              <h3>No active auctions right now.</h3>
              <p>Check back soon for new drops!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Auction;
