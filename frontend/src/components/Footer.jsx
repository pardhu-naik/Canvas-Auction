import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiGithub } from 'react-icons/fi';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="logo">
            Art<span>Gallery</span>
          </Link>
          <p>Discover, collect, and sell extraordinary digital artworks and physical pieces from around the world.</p>
          <div className="social-links">
            <a href="#"><FiInstagram /></a>
            <a href="#"><FiTwitter /></a>
            <a href="#"><FiFacebook /></a>
            <a href="#"><FiGithub /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-group">
            <h4>Platform</h4>
            <Link to="/gallery">Gallery</Link>
            <Link to="/auction">Auctions</Link>
            <Link to="/artists">Artists</Link>
          </div>

          <div className="footer-group">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>

          <div className="footer-group newsletter">
            <h4>Newsletter</h4>
            <p>Join our mailing list for latest news and drops.</p>
            <div className="newsletter-input">
              <input type="email" placeholder="Email address" />
              <button className="btn btn-primary">Join</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Art Gallery & Auction Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
