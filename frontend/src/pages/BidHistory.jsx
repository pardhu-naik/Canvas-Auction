import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Loader from '../components/Loader';

const BidHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    const fetchBids = async () => {
      try {
        const { data } = await API.get('/bids/my/history');
        setBids(data);
      } catch (error) {
        console.error('Error fetching bid history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [user]);

  if (!user) return <div className="container" style={{paddingTop: '100px'}}>Please login to view your bid history.</div>;
  if (loading) return <Loader />;

  return (
    <div className="container" style={{paddingTop: '100px', minHeight: '80vh'}}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <FiClock color="var(--primary-color)" /> Bid History
        </h2>
        
        {bids.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {bids.map((bid) => (
              <div key={bid._id} className="glass-card" style={{ display: 'flex', gap: '20px', padding: '20px', alignItems: 'center' }}>
                <img 
                  src={bid.artwork?.image} 
                  alt={bid.artwork?.title} 
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => navigate(`/artwork/${bid.artwork?._id}`)}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '5px', cursor: 'pointer' }} onClick={() => navigate(`/artwork/${bid.artwork?._id}`)}>
                    {bid.artwork?.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    by {bid.artwork?.artist?.name}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>${bid.bidAmount}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)' }}>
                    {new Date(bid.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {bid.artwork?.highestBid === bid.bidAmount ? (
                    <p style={{ color: '#059669', fontWeight: 600, fontSize: '0.8rem', marginTop: '4px' }}>🏆 Highest Bid</p>
                  ) : (
                    <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.8rem', marginTop: '4px' }}>Outbid</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
               <FiClock size={50} style={{ color: 'var(--text-secondary-light)', opacity: 0.5 }} />
            </div>
            <h3>No bids placed yet</h3>
            <p style={{ color: 'var(--text-secondary-light)', marginTop: '10px' }}>
              Participate in our live auctions to see your bid history.
            </p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/auction')}>
              View Active Auctions
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BidHistory;
