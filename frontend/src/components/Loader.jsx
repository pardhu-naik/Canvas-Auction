import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-light)',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <motion.div
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid var(--primary-color)',
          borderTopColor: 'transparent',
          borderRadius: '50%'
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p style={{ fontWeight: 600 }}>Loading Art Collection...</p>
    </div>
  );
};

export default Loader;
