import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiImage, FiTag, FiDollarSign, FiType, FiFileText } from 'react-icons/fi';
import CustomSelect from '../components/CustomSelect';
import api from '../services/api';
import toast from 'react-hot-toast';

const UploadArtwork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Painting',
    price: '',
    image: '',
  });
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Block non-artists
  if (!user || user.role !== 'artist') {
    return (
      <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>
        <h2>Access Denied</h2>
        <p>You must be a verified artist to upload artwork.</p>
        <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an artwork image');
      return;
    }
    
    setLoading(true);

    try {
      // 1. Upload the image file first
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      
      const { data: uploadData } = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Submit the artwork with the returned image URL
      await api.post('/artworks', {
        ...formData,
        image: uploadData.imageUrl
      });

      toast.success('Artwork successfully uploaded!');
      navigate('/gallery');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <motion.div 
        className="glass-card" 
        style={{ maxWidth: '700px', margin: '0 auto', padding: '40px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <FiUploadCloud size={50} color="var(--primary-color)" style={{ marginBottom: '15px' }} />
          <h2>Upload Your Masterpiece</h2>
          <p style={{ color: 'var(--text-secondary-light)' }}>Showcase your brilliant artwork to thousands of collectors worldwide.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Artwork Title</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', padding: '0 15px', border: '1px solid var(--border-color)' }}>
              <FiType color="var(--text-secondary-light)" />
              <input 
                type="text" 
                name="title" 
                placeholder="E.g., Starry Night" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '15px', border: 'none', background: 'transparent', outline: 'none', color: 'inherit' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', padding: '15px', border: '1px solid var(--border-color)' }}>
              <FiFileText color="var(--text-secondary-light)" style={{ marginTop: '5px' }} />
              <textarea 
                name="description" 
                placeholder="Share the story and inspiration behind this piece..." 
                value={formData.description} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', resize: 'vertical', minHeight: '100px', paddingLeft: '15px', color: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary-light)' }}>
                Masterpiece Category
              </label>
              <CustomSelect 
                options={[
                    { value: 'Painting', label: 'Painting', icon: '🖌️' },
                    { value: 'Digital Art', label: 'Digital Art', icon: '🎨' },
                    { value: 'Photography', label: 'Photography', icon: '📸' },
                    { value: 'Sculpture', label: 'Sculpture', icon: '🗿' },
                    { value: 'Mixed Media', label: 'Mixed Media', icon: '🎭' }
                ]}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                placeholder="Choose category"
                icon={FiTag}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary-light)' }}>
                Listing Price (USD)
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#ffffff', 
                borderRadius: '12px', 
                padding: '0 18px', 
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                height: '48px'
              }}>
                <FiDollarSign color="var(--primary-color)" />
                <input 
                  type="number" 
                  name="price" 
                  placeholder="0.00" 
                  min="0"
                  step="1"
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '10px', border: 'none', background: 'transparent', outline: 'none', color: '#1a1a2e', fontWeight: '600' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Artwork Image</label>
            <div 
              onClick={() => document.getElementById('artwork-file').click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.03)';
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile && droppedFile.type.startsWith('image/')) {
                  if (droppedFile.size > 5 * 1024 * 1024) {
                    toast.error('File size too large. Limit is 5MB.');
                    return;
                  }
                  setFile(droppedFile);
                  setPreview(URL.createObjectURL(droppedFile));
                }
              }}
              style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: '15px', 
                padding: '40px', 
                textAlign: 'center', 
                cursor: 'pointer',
                background: 'rgba(99, 102, 241, 0.03)',
                transition: 'all 0.3s ease',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {preview ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                  <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--primary-color)' }}>Click or drag new image to replace</p>
                </div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <FiUploadCloud size={50} color="var(--primary-color)" style={{ marginBottom: '15px' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Drag & drop your artwork here</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary-light)' }}>or click to browse files</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary-light)', marginTop: '15px', background: 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: '20px' }}>PNG, JPG, WebP up to 5MB</span>
                </>
              )}
              <input 
                id="artwork-file"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '20px', padding: '15px', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Artwork'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadArtwork;
