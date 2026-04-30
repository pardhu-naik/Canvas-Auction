import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import socket from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    try {
      const storedWishlist = JSON.parse(localStorage.getItem('myWishlist') || '[]');
      setWishlist(storedWishlist);
    } catch (error) {
      console.error('Error reading wishlist from local storage', error);
      setWishlist([]);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        setUser(data);
        socket.emit('setup', data);
        fetchWishlist();
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    socket.emit('setup', data);
    fetchWishlist();
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    setUser(data);
    socket.emit('setup', data);
    fetchWishlist();
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
    setWishlist([]);
  };

  const toggleWishlist = async (artwork) => {
    if (!user) return false;
    
    try {
      const isWishlisted = wishlist.some(item => item._id === artwork._id);
      let updatedWishlist;
      
      if (isWishlisted) {
        updatedWishlist = wishlist.filter(item => item._id !== artwork._id);
      } else {
        updatedWishlist = [...wishlist, artwork];
      }
      
      setWishlist(updatedWishlist);
      localStorage.setItem('myWishlist', JSON.stringify(updatedWishlist));
      return true;
    } catch (error) {
      console.error('Wishlist error', error);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    const { data } = await API.put('/auth/profile', profileData);
    setUser(data);
    return data;
  };

  const forgotPassword = async (mobileNumber) => {
    await API.post('/auth/forgot-password', { mobileNumber });
  };

  const resetPassword = async (mobileNumber, otp, password) => {
    await API.post('/auth/reset-password', { mobileNumber, otp, password });
  };

  const requestVerification = async (portfolioUrl, documentUrl) => {
    const { data } = await API.post('/auth/verify-request', { portfolioUrl, documentUrl });
    // Refresh user profile to get updated verificationStatus
    const profileResponse = await API.get('/auth/profile');
    setUser(profileResponse.data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, setUser, loading, wishlist, 
      login, register, logout, updateProfile, 
      forgotPassword, resetPassword, toggleWishlist,
      requestVerification
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
