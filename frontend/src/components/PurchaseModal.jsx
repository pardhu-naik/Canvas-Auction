import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiCreditCard, FiTruck, FiShield } from 'react-icons/fi';
import API from '../services/api';
import toast from 'react-hot-toast';

const PurchaseModal = ({ artwork, onClose, onPurchaseSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Confirm, 2: Success

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await API.post(`/artworks/${artwork._id}/purchase`);
      setStep(2);
      if (onPurchaseSuccess) onPurchaseSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }} onClick={onClose}>
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '500px',
            width: '100%',
            padding: '40px',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            <FiX size={24} />
          </button>

          {step === 1 ? (
            <>
              <div style={{ marginBottom: '30px' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <FiCreditCard size={40} color="var(--primary-color)" />
                </div>
                <h2>Confirm Purchase</h2>
                <p style={{ color: 'var(--text-secondary-light)' }}>You are about to purchase <strong>{artwork.title}</strong></p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '30px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Price</span>
                  <span style={{ fontWeight: 700 }}>${artwork.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>FREE</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '15px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900 }}>
                  <span>Total</span>
                  <span className="gradient-text">${artwork.price}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-secondary-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FiShield /> Secure Payment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FiTruck /> Global Shipping
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay & Complete Purchase'}
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={{ marginBottom: '30px' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <FiCheckCircle size={60} color="var(--success-color)" />
                </div>
                <h2 className="gradient-text">Purchase Successful!</h2>
                <p style={{ color: 'var(--text-secondary-light)', marginTop: '10px' }}>
                  Congratulations! <strong>{artwork.title}</strong> is now yours. We've sent a confirmation email to your registered address.
                </p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
                Back to Gallery
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PurchaseModal;
