import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUpload, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfileUpload = () => {
  const { user, updateProfile } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Upload the image file
      const { data: uploadData } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 2. Update the user profile with the new image URL
      await updateProfile({ profileImage: uploadData.imageUrl });
      
      toast.success('Profile picture updated successfully!');
      setFile(null);
    } catch (error) {
      console.error('Error uploading profile picture', error);
      toast.error('Failed to upload profile picture. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-upload-container glass-card" style={{ padding: '20px', borderRadius: '15px', textAlign: 'center', margin: '20px auto', maxWidth: '300px' }}>
      <div className="avatar-preview" style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>
        {preview ? (
          <img src={preview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          user?.profilePicture ? <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />
        )}
      </div>
      
      <div className="upload-controls">
        <input 
          type="file" 
          id="profilePic" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
        <label htmlFor="profilePic" className="btn" style={{ display: 'inline-block', cursor: 'pointer', marginBottom: '10px', width: '100%' }}>
          Choose Image
        </label>
        
        {file && (
          <button 
            className="btn btn-primary" 
            onClick={handleUpload} 
            disabled={uploading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <FiUpload /> {uploading ? 'Uploading...' : 'Save Picture'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileUpload;
