import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import PurchaseModal from './PurchaseModal';
import { useAuth } from '../context/AuthContext';
import '../styles/cards.css';

const ArtworkCard = ({ artwork }) => {
  const { user, toggleWishlist, wishlist } = useAuth();
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [localStatus, setLocalStatus] = useState(artwork.status);
  
  const isAuction = artwork.status === 'auction';
  const isWishlisted = wishlist.some(item => item._id === artwork._id);

  const handleBuyNowClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) return navigate('/login');
    await toggleWishlist(artwork);
  };

  return (
    <>
      <motion.div 
        className="artwork-card glass-card tilt-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ 
          y: -10,
          transition: { duration: 0.3 }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // Ensure equal height in grid
          overflow: 'hidden'
        }}
      >
        <div className="card-image" style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
          <motion.img 
            src={artwork.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={artwork.title || 'Artwork'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
          <motion.button 
            className="wishlist-btn"
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
                background: isWishlisted ? 'var(--danger-color)' : 'rgba(255,255,255,0.2)',
                color: isWishlisted ? 'white' : 'inherit'
            }}
          >
            <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
          </motion.button>
          {localStatus === 'sold' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', border: '3px solid white', padding: '10px 20px', borderRadius: '10px', transform: 'rotate(-15deg)' }}>SOLD OUT</span>
            </div>
          )}
          {isAuction && localStatus !== 'sold' && (
            <div className="auction-badge" style={{ animation: 'pulse-glow 2s infinite' }}>
              <FiClock /> Auction Live
            </div>
          )}
        </div>

        <div className="card-info" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ marginBottom: 'auto' }}>
            <span className="category gradient-text" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{artwork.category || 'Uncategorized'}</span>
            <h3 className="title" style={{ fontSize: '1.25rem', marginTop: '8px', fontWeight: 800, lineHeight: '1.4' }}>{artwork.title || 'Untitled Masterpiece'}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary-light)' }}>By {artwork.artist?.name || 'Unknown Artist'}</span>
              {artwork.artist?.isVerified && (
                <FiCheckCircle size={14} color="#4CAF50" title="Verified Artist" />
              )}
            </div>
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
            <div className="price-info">
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)' }}>{isAuction ? 'Highest Bid' : 'Fixed Price'}</span>
              <p className="price" style={{ color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 900, marginTop: '2px' }}>
                ${isAuction ? (artwork.highestBid || artwork.price || 0) : (artwork.price || 0)}
              </p>
            </div>
            
            <Link to={`/artwork/${artwork._id}`} className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)' }}>
              View Details
            </Link>
          </div>
        </div>
      </motion.div>

      {showPurchaseModal && (
        <PurchaseModal 
          artwork={artwork} 
          onClose={() => setShowPurchaseModal(false)} 
          onPurchaseSuccess={() => setLocalStatus('sold')}
        />
      )}
    </>
  );
};

export default ArtworkCard;
