import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiUser, FiBell, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProfileUpload from '../components/ProfileUpload';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, requestVerification } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.verificationRequest?.portfolioUrl || '');
  const [documentUrl, setDocumentUrl] = useState(user?.verificationRequest?.documentUrl || '');
  const [saving, setSaving] = useState(false);
  const [requesting, setRequesting] = useState(false);
  
  if (!user) return <div className="container" style={{paddingTop: '100px'}}>Please login to view settings.</div>;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!updateProfile) {
      console.error('UpdateProfile function missing from context');
      return;
    }

    setSaving(true);
    try {
      const updatedData = await updateProfile({ name, bio });
      if (updatedData) {
        toast.success('Profile settings updated successfully!');
      }
    } catch (error) {
      console.error('Profile Update Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerification = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await requestVerification(portfolioUrl, documentUrl);
      toast.success('Verification request submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="container" style={{paddingTop: '100px', minHeight: '80vh'}}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <FiSettings /> Account Settings
        </h2>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: '250px 1fr' }}>
          <div className="glass-card" style={{ padding: '20px', height: 'fit-content' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`} 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', background: activeTab !== 'profile' ? 'transparent' : '', color: activeTab !== 'profile' ? 'var(--text-primary-light)' : '' }}
                  onClick={() => setActiveTab('profile')}
                >
                  <FiUser /> Profile Info
                </button>
              </li>
              <li>
                <button 
                  className={`btn ${activeTab === 'notifications' ? 'btn-primary' : ''}`} 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', background: activeTab !== 'notifications' ? 'transparent' : '', color: activeTab !== 'notifications' ? 'var(--text-primary-light)' : '' }}
                  onClick={() => setActiveTab('notifications')}
                >
                  <FiBell /> Notifications
                </button>
              </li>
              <li>
                <button 
                  className={`btn ${activeTab === 'security' ? 'btn-primary' : ''}`} 
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', background: activeTab !== 'security' ? 'transparent' : '', color: activeTab !== 'security' ? 'var(--text-primary-light)' : '' }}
                  onClick={() => setActiveTab('security')}
                >
                  <FiShield /> Security
                </button>
              </li>
              {user.role === 'artist' && (
                <li>
                  <button 
                    className={`btn ${activeTab === 'verification' ? 'btn-primary' : ''}`} 
                    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', background: activeTab !== 'verification' ? 'transparent' : '', color: activeTab !== 'verification' ? 'var(--text-primary-light)' : '' }}
                    onClick={() => setActiveTab('verification')}
                  >
                    <FiCheckCircle /> Verification
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          <div className="glass-card" style={{ padding: '30px' }}>
            {activeTab === 'profile' && (
              <div>
                <h3>Profile Information</h3>
                <p style={{ color: 'var(--text-secondary-light)', marginBottom: '30px' }}>Update your account profile details and picture.</p>
                
                <ProfileUpload />
                
                <form onSubmit={handleSaveProfile} style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label>Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'inherit', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label>Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'inherit', minHeight: '80px', resize: 'vertical', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label>Email Address</label>
                    <input type="email" defaultValue={user.email} style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.05)', color: 'inherit', opacity: 0.7 }} disabled />
                    <small style={{ color: 'var(--text-secondary-light)' }}>Email cannot be changed.</small>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h3>Notification Preferences</h3>
                <p style={{ color: 'var(--text-secondary-light)', marginBottom: '30px' }}>Manage how you receive notifications.</p>
                <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked /> Email alerts for successful bids
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '15px' }}>
                    <input type="checkbox" defaultChecked /> Push notifications for outbids
                  </label>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h3>Security Settings</h3>
                <p style={{ color: 'var(--text-secondary-light)', marginBottom: '30px' }}>Manage your password and security.</p>
                <button className="btn" onClick={() => toast('Password reset link sent!')}>Reset Password</button>
              </div>
            )}
            
            {activeTab === 'verification' && (
              <div>
                <h3>Artist Verification</h3>
                <p style={{ color: 'var(--text-secondary-light)', marginBottom: '30px' }}>
                  Get a verification badge to build trust with collectors.
                </p>
                
                {user.verificationStatus === 'verified' ? (
                  <div className="glass-card" style={{ padding: '30px', textAlign: 'center', border: '1px solid #4CAF50', background: 'rgba(76, 175, 80, 0.05)' }}>
                    <FiCheckCircle size={50} color="#4CAF50" style={{ marginBottom: '15px' }} />
                    <h4 style={{ color: '#4CAF50' }}>You are a Verified Artist</h4>
                    <p>Your profile now displays a verification badge.</p>
                  </div>
                ) : user.verificationStatus === 'pending' ? (
                  <div className="glass-card" style={{ padding: '30px', textAlign: 'center', border: '1px solid #FF9800', background: 'rgba(255, 152, 0, 0.05)' }}>
                    <h4 style={{ color: '#FF9800' }}>Verification Pending</h4>
                    <p>Your application is currently being reviewed by our team.</p>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary-light)' }}>
                      <strong>Portfolio:</strong> {user.verificationRequest?.portfolioUrl}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRequestVerification} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {user.verificationStatus === 'rejected' && (
                      <div style={{ padding: '15px', borderRadius: '8px', background: 'rgba(244, 67, 54, 0.1)', color: '#f44336', border: '1px solid rgba(244, 67, 54, 0.2)', marginBottom: '10px' }}>
                        Your previous request was declined. Please update your details and try again.
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label>Portfolio Website / Social Link</label>
                      <input 
                        type="url" 
                        placeholder="https://behance.net/yourname" 
                        value={portfolioUrl} 
                        onChange={(e) => setPortfolioUrl(e.target.value)} 
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'inherit', outline: 'none' }} 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label>Identity Document Link (ID/Passport)</label>
                      <input 
                        type="url" 
                        placeholder="Link to your ID document (Drive/Dropbox)" 
                        value={documentUrl} 
                        onChange={(e) => setDocumentUrl(e.target.value)} 
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', color: 'inherit', outline: 'none' }} 
                      />
                      <small style={{ color: 'var(--text-secondary-light)' }}>We use this only for identity verification.</small>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={requesting}>
                      {requesting ? 'Submitting...' : 'Submit Verification Request'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
