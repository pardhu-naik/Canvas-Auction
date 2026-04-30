import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiLoader, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import API from '../services/api';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    const pId = searchParams.get('payment_id');
    if (pId) setPaymentId(pId);
  }, [searchParams]);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '100px', textAlign: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 40px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCheckCircle size={50} color="var(--success-color)" />
            </div>
            <h2 style={{ fontSize: '2rem' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-secondary-light)', lineHeight: '1.6' }}>
              Congratulations! You are now the proud owner of this masterpiece. 
              {paymentId && <span style={{ display: 'block', marginTop: '10px', fontSize: '0.9rem', color: 'var(--primary-color)' }}>Ref: {paymentId}</span>}
            </p>
            <div style={{ display: 'flex', gap: '15px', width: '100%', marginTop: '20px' }}>
              <Link to="/orders" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <FiShoppingBag /> My Orders
              </Link>
            </div>
          </div>
      </motion.div>
    </div>
  );
};

export default Success;
