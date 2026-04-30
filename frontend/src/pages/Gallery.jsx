import React, { useState, useEffect } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import CustomSelect from '../components/CustomSelect';
import API from '../services/api';
import Loader from '../components/Loader';
import { FiSearch, FiFilter, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/gallery.css';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [era, setEra] = useState('');

  const categoryOptions = [
    { value: '', label: 'All Categories', icon: '🌍' },
    { value: 'digital', label: 'Digital Art', icon: '🎨' },
    { value: 'photography', label: 'Photography', icon: '📸' },
    { value: 'painting', label: 'Painting', icon: '🖌️' },
    { value: 'sculpture', label: 'Sculpture', icon: '🗿' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
  ];

  const colorOptions = [
    { value: '', label: 'Any Color' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
  ];

  const styleOptions = [
    { value: '', label: 'Any Style' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'realism', label: 'Realism' },
    { value: 'impressionism', label: 'Impressionism' },
    { value: 'surrealism', label: 'Surrealism' },
    { value: 'popart', label: 'Pop Art' },
  ];

  const eraOptions = [
    { value: '', label: 'Any Era' },
    { value: 'renaissance', label: 'Renaissance' },
    { value: 'modern', label: 'Modern' },
    { value: 'contemporary', label: 'Contemporary' },
  ];

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/artworks?category=${category}&search=${search}&sort=${sort}&color=${color}&style=${style}&era=${era}`);
        setArtworks(data);
      } catch (error) {
        console.error('Error fetching artworks', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchArtworks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [category, search, sort, color, style, era]);

  return (
    <div className="gallery-page container" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
      <header className="gallery-header" style={{ marginBottom: '80px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '20px' }}>
            Art <span className="gradient-text">Gallery</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary-light)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Discover a curated collection of masterpieces from world-class artists. 
            Filter by category to find the perfect piece for your collection.
          </p>
        </motion.div>
      </header>

      <section className="filters-container" style={{ marginBottom: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
        <div className="filters-section" style={{ width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ flex: '1', minWidth: '300px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '15px', padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FiSearch style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }} />
            <input 
              type="text" 
              placeholder="Search by artwork name or artist..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', width: '100%', outline: 'none', fontSize: '1rem' }}
            />
          </div>

          <div className="filter-controls" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <CustomSelect 
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="All Categories"
              icon={FiFilter}
            />

            <CustomSelect 
              options={sortOptions}
              value={sort}
              onChange={setSort}
              placeholder="Sort by"
              icon={FiTrendingUp}
            />
          </div>
          
          <div className="filter-controls-advanced" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CustomSelect 
              options={colorOptions}
              value={color}
              onChange={setColor}
              placeholder="Color"
            />
            <CustomSelect 
              options={styleOptions}
              value={style}
              onChange={setStyle}
              placeholder="Style"
            />
            <CustomSelect 
              options={eraOptions}
              value={era}
              onChange={setEra}
              placeholder="Era"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <div className="artwork-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
          {artworks.length > 0 ? (
            artworks.map((art, index) => (
              <motion.div
                key={art._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArtworkCard artwork={art} />
              </motion.div>
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>No masterpieces found.</h3>
              <p style={{ color: 'var(--text-secondary-light)' }}>Try refining your search or exploring different categories.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
