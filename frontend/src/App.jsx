import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ArtworkDetails from './pages/ArtworkDetails';
import Auction from './pages/Auction';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import Wishlist from './pages/Wishlist';
import BidHistory from './pages/BidHistory';
import Settings from './pages/Settings';
import UploadArtwork from './pages/UploadArtwork';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyOrders from './pages/MyOrders';
import Success from './pages/Success';
import Admin from './pages/Admin';
import { Toaster } from 'react-hot-toast';

function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="app">
      <Toaster position="top-right" />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artwork/:id" element={<ArtworkDetails />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/success" element={<Success />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/bid-history" element={<BidHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<UploadArtwork />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
