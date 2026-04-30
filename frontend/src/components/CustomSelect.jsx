import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const CustomSelect = ({ options, value, onChange, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpwards(spaceBelow < 280);
      }
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (e, optionValue) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container" ref={containerRef} style={{ position: 'relative', minWidth: '220px', zIndex: isOpen ? 9999 : 10 }}>
      <motion.div
        className="custom-select-header"
        onClick={handleToggle}
        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          background: '#ffffff', // Light mode default
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          userSelect: 'none',
          boxShadow: isOpen ? '0 0 0 2px var(--primary-color)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {Icon && <Icon style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }} />}
          <span className="select-text" style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', opacity: 0.6 }}
        >
          <FiChevronDown />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: openUpwards ? -8 : 8, scale: 1 }}
            exit={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
            transition={{ 
                duration: 0.25, 
                ease: [0.22, 1, 0.36, 1],
                type: 'spring',
                damping: 20,
                stiffness: 300
            }}
            style={{
              position: 'absolute',
              bottom: openUpwards ? '100%' : 'auto',
              top: openUpwards ? 'auto' : '100%',
              left: 0,
              right: 0,
              zIndex: 1001,
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              padding: '6px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              listStyle: 'none',
              maxHeight: '280px',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                onClick={(e) => handleOptionClick(e, option.value)}
                whileHover={{ 
                    x: 4, 
                    scale: 1.02,
                    backgroundColor: value === option.value ? 'var(--primary-color)' : 'rgba(99, 102, 241, 0.05)' 
                }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: value === option.value ? 'var(--primary-color)' : 'transparent',
                  color: value === option.value ? '#ffffff' : '#1f2937',
                  fontSize: '0.9rem',
                  fontWeight: value === option.value ? 700 : 500,
                  marginBottom: '2px',
                  boxShadow: value === option.value ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                {option.icon && <span style={{ fontSize: '1.1rem' }}>{option.icon}</span>}
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
