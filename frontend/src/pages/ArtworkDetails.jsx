import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign, FiUser, FiInfo, FiTag, FiTag as FiCategory, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import API from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../styles/artworkDetails.css';

const ArtworkDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const { data } = await API.get(`/artworks/${id}`);
        setArtwork(data);
        if (data.status === 'auction') {
            setBidAmount(data.highestBid + 10 || data.price + 10);
        }
      } catch (error) {
        console.error('Error fetching artwork', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();

    // Socket.io for Real-time bidding
    socket.connect();
    socket.emit('join_auction', id);

    socket.on('update_bid', (data) => {
      if (data.artworkId === id) {
        setArtwork(prev => ({ 
          ...prev, 
          highestBid: data.bidAmount,
          highestBidder: data.userId 
        }));
        setMessage({ type: 'success', text: `New bid placed: $${data.bidAmount}!` });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    });

    return () => {
      socket.emit('leave_auction', id);
      socket.off('update_bid');
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (artwork?.auctionEnd) {
      const timer = setInterval(() => {
        const end = new Date(artwork.auctionEnd).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft('Auction Ended');
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [artwork]);

  const [purchasing, setPurchasing] = useState(false);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    try {
      await API.post('/bids', { artworkId: id, bidAmount: parseFloat(bidAmount) });
      socket.emit('place_bid', { 
        artworkId: id, 
        bidAmount: parseFloat(bidAmount),
        userId: user._id,
        userName: user.name 
      });
      setMessage({ type: 'success', text: 'You placed a bid successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to place bid' });
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!user) return navigate('/login');
    
    setPurchasing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder = {
        _id: Math.random().toString(36).substr(2, 9),
        artwork: {
          _id: artwork._id,
          title: artwork.title,
          image: artwork.image
        },
        totalAmount: artwork.highestBid || artwork.price,
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      };

      const existingOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      localStorage.setItem('myOrders', JSON.stringify([newOrder, ...existingOrders]));

      setMessage({ type: 'success', text: 'Payment successful! Adding to your orders...' });
      
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
      
    } catch (err) {
      console.error('Purchase Error:', err);
      setMessage({ type: 'error', text: 'Purchase simulation failed.' });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <Loader />;
  if (!artwork) return <div className="container">Artwork not found</div>;

  return (
    <div className="artwork-details-page container">
      <div className="artwork-grid-details">
        <motion.div 
            className="artwork-image-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
          <img src={artwork.image} alt={artwork.title} />
        </motion.div>

        <motion.div 
            className="artwork-info-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
          <div className="category-badge">{artwork.category}</div>
          <h1>{artwork.title}</h1>
          
          <div className="artist-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser />
            <span>by <strong>{artwork.artist?.name}</strong></span>
            {artwork.artist?.isVerified && (
              <FiCheckCircle size={16} color="#4CAF50" title="Verified Artist" />
            )}
          </div>

          <p className="description">{artwork.description}</p>

          <div className="status-grid">
            <div className="status-item">
              <FiTag />
              <div>
                <span>Status</span>
                <p>{artwork.status.toUpperCase()}</p>
              </div>
            </div>
            {artwork.status === 'auction' && (
              <div className="status-item">
                <FiClock />
                <div>
                  <span>Time Left</span>
                  <p>{timeLeft}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pricing-card glass-card" style={{ marginTop: '40px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <div className="price-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {artwork.status === 'auction' ? 'Current Highest Bid' : 'Ownership Price'}
                    </span>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginTop: '10px' }} className="gradient-text">
                        ${artwork.highestBid || artwork.price}
                    </h2>
                </div>
                {artwork.status === 'available' && (
                  <button 
                    className="btn btn-primary" 
                    onClick={handlePurchase}
                    disabled={purchasing}
                    style={{ padding: '15px 35px', fontSize: '1.1rem', borderRadius: '15px' }}
                  >
                    {purchasing ? 'Processing...' : 'Buy Now'}
                  </button>
                )}
            </div>

            {(artwork.status === 'auction' || artwork.status === 'available') && message.text && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`alert alert-${message.type}`} 
                style={{ marginBottom: '30px', padding: '15px 25px' }}
              >
                {message.text}
              </motion.div>
            )}

            {artwork.status === 'auction' && (
              <div className="bidding-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
                <h3 style={{ marginBottom: '25px', fontSize: '1.4rem' }}>Place a Bid</h3>
                <form onSubmit={handlePlaceBid} className="bid-form" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="input-with-icon" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FiDollarSign style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }} />
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={artwork.highestBid + 1}
                      style={{ fontSize: '1.5rem', fontWeight: 700, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'inherit' }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem', borderRadius: '15px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                    Place Bid
                  </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <p className="hint" style={{ fontSize: '0.9rem' }}>Minimum next bid: <strong>${artwork.highestBid + 1}</strong></p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--success-color)', fontWeight: 600 }}>Active Auction</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArtworkDetails;
