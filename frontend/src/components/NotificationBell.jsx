import React, { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import socket from '../services/socket';
import toast from 'react-hot-toast';
import { format } from 'timeago.js';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/api/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.readStatus).length);
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Socket listener for real-time outbid notifications
    socket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast(data.message, { icon: '🔔' });
    });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      socket.off('notification');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, readStatus: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read', error);
    }
  };

  return (
    <div className="notification-bell-container" style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        className="icon-btn" 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ position: 'relative' }}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge" style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--danger-color, #ef4444)',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: '2px solid var(--card-bg, #fff)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div 
            className="notification-dropdown glass-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '15px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.15)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>Notifications</h4>
              {unreadCount > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>{unreadCount} New</span>}
            </div>

            {notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => (
                  <div 
                    key={n._id} 
                    className={`notification-item ${!n.readStatus ? 'unread' : ''}`}
                    onClick={() => !n.readStatus && handleMarkAsRead(n._id)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      background: !n.readStatus ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                      borderLeft: !n.readStatus ? '3px solid var(--primary-color)' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <p style={{ margin: '0 0 5px 0', lineHeight: '1.4' }}>{n.message}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary-light)' }}>{format(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary-light)' }}>
                No notifications yet.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
