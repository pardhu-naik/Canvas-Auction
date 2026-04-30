import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTrendingUp, FiZap, FiCamera, FiLayout, FiGlobe } from 'react-icons/fi';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          >
            <motion.span 
              className="gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}
            >
              The Future of Art Bidding
            </motion.span>
            <h1 style={{ marginTop: '10px' }}>
              Where <span className="gradient-text">Creativity</span> Meets the <span className="gradient-text">Auction</span> Floor
            </h1>
            <p>Experience the world's most interactive art marketplace. Bid on exclusive pieces from top artists in real-time with stunning clarity and security.</p>
            <div className="hero-btns">
              <Link to="/gallery" className="btn btn-primary">
                Explore Gallery <FiArrowRight />
              </Link>
              <Link to="/auction" className="btn" style={{ border: '2px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                Live Auctions
              </Link>
            </div>
          </motion.div>
          
          <div className="hero-image perspective-container">
            <motion.div 
              className="art-float-card tilt-card glass-card"
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, type: "spring" }}
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                <img 
                  src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800" 
                  alt="Hero Art" 
                  style={{ width: '100%', display: 'block', transition: 'transform 0.5s ease' }}
                />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                  LIVE AUCTION
                </div>
              </div>
              <div className="float-info" style={{ marginTop: '20px' }}>
                <div style={{ transform: 'translateZ(30px)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)', textTransform: 'uppercase' }}>Current Bid</span>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)' }}>12.45 ETH</p>
                </div>
                <div style={{ textAlign: 'right', transform: 'translateZ(30px)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary-light)', textTransform: 'uppercase' }}>Auction Ends</span>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>04h : 12m : 30s</p>
                </div>
              </div>
            </motion.div>
            
            {/* Background elements for 3D feel */}
            <motion.div 
              style={{ 
                position: 'absolute', 
                top: '-20px', 
                left: '-20px', 
                width: '100px', 
                height: '100px', 
                background: 'var(--primary-glow)', 
                filter: 'blur(40px)', 
                borderRadius: '50%',
                zIndex: -1
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-grid container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Revolutionizing <span className="gradient-text">Art Commerce</span></h2>
          <p style={{ maxWidth: '600px', margin: '15px auto 0' }}>Our platform combines state-of-the-art technology with a deep appreciation for artistic expression.</p>
        </div>
        
        <div className="features">
          <motion.div className="feature-card glass-card tilt-card" whileHover={{ translateZ: 50 }}>
            <div className="feature-icon"><FiZap /></div>
            <h3>Real-time Bidding</h3>
            <p>Bid with zero latency. Our WebSocket-powered auction floor ensures you never miss a masterpiece.</p>
          </motion.div>
          <motion.div className="feature-card glass-card tilt-card" whileHover={{ translateZ: 50 }}>
            <div className="feature-icon"><FiShield /></div>
            <h3>Bulletproof Security</h3>
            <p>Your transactions and identity are protected by advanced cryptographic standards and JWT auth.</p>
          </motion.div>
          <motion.div className="feature-card glass-card tilt-card" whileHover={{ translateZ: 50 }}>
            <div className="feature-icon"><FiGlobe /></div>
            <h3>Global Reach</h3>
            <p>Connect with prestigious collectors and visionary artists from every corner of the world.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '80px 0', marginTop: '100px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <div>
            <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>25K+</h3>
            <p style={{ fontWeight: 600 }}>Active Collectors</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>$12M+</h3>
            <p style={{ fontWeight: 600 }}>Art Sales</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>1.5K+</h3>
            <p style={{ fontWeight: 600 }}>Verified Artists</p>
          </div>
          <div>
            <h3 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>100%</h3>
            <p style={{ fontWeight: 600 }}>Secure Bids</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container" style={{ marginTop: '120px', marginBottom: '100px' }}>
        <motion.div 
          className="cta-card glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{ 
            padding: '80px 40px', 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid var(--primary-glow)',
            boxShadow: 'var(--shadow-glow)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <h2 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Join the <span className="gradient-text">Elite Circle</span></h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Start your journey as a creator or collector today. The next masterpiece is waiting for your bid.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Create Account</Link>
            <Link to="/gallery" className="btn" style={{ border: '2px solid var(--primary-color)', color: 'var(--primary-color)', padding: '15px 40px' }}>Browse Art</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
