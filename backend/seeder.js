const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Artwork = require('./models/Artwork');

dotenv.config();

const connectDB = require('./config/db');


const artworks = [
  {
    title: 'Neon Cyber City',
    description: 'A vivid exploration of neo-tokyo aesthetics in a dystopian future. Hand-painted textures combined with digital mastering.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=2000&auto=format&fit=crop',
    price: 450,
    status: 'available',
    color: 'blue',
    style: 'popart',
    era: 'contemporary'
  },
  {
    title: 'Abstract Harmony',
    description: 'Merging chaotic brush strokes with serene color palettes. This piece explores the balance between order and chaos.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2000&auto=format&fit=crop',
    price: 2800,
    status: 'auction',
    auctionStart: new Date(),
    auctionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    highestBid: 3100,
    color: 'yellow',
    style: 'abstract',
    era: 'modern'
  },
  {
    title: 'Golden Hour Reflections',
    description: 'Photography capturing the serenity of nature during the final moments of sunset over the Pacific.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1506744626753-dba37c10e58e?q=80&w=2000&auto=format&fit=crop',
    price: 150,
    status: 'available',
    color: 'yellow',
    style: 'realism',
    era: 'contemporary'
  },
  {
    title: 'Modern Architecture',
    description: 'Clean lines, brutalist concepts and soft shadows defining the perfect structure in the heart of Berlin.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop',
    price: 850,
    status: 'auction',
    auctionStart: new Date(),
    auctionEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    highestBid: 920,
    color: 'black',
    style: 'modern',
    era: 'modern'
  },
  {
    title: 'Surrealist Dream',
    description: 'A mind-bending journey through subconscious imagery and impossible geometry.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
    price: 1200,
    status: 'available',
    color: 'blue',
    style: 'surrealism',
    era: 'contemporary'
  },
  {
    title: 'The Silent Watcher',
    description: 'A minimalist sculpture carved from a single block of white marble, representing peace.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=2000&auto=format&fit=crop',
    price: 5000,
    status: 'auction',
    auctionStart: new Date(),
    auctionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    highestBid: 5500,
    color: 'white',
    style: 'modern',
    era: 'contemporary'
  },
  {
    title: 'Cyberpunk Rebellion',
    description: 'An glitch-art inspired portrait of a futuristic freedom fighter.',
    category: 'Digital',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2000&auto=format&fit=crop',
    price: 350,
    status: 'available',
    color: 'red',
    style: 'popart',
    era: 'contemporary'
  },
  {
    title: 'Emerald Forest',
    description: 'Oil on canvas. A deep dive into the lush greens of the Amazon rainforest.',
    category: 'Painting',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop',
    price: 1800,
    status: 'available',
    color: 'green',
    style: 'impressionism',
    era: 'modern'
  },
  {
    title: 'Ancient Wisdom',
    description: 'Bronze casting of a philosopher’s head, aged with a natural patina.',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2000&auto=format&fit=crop',
    price: 3200,
    status: 'auction',
    auctionStart: new Date(),
    auctionEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    highestBid: 3450,
    color: 'black',
    style: 'realism',
    era: 'renaissance'
  },
  {
    title: 'Urban Solitude',
    description: 'Black and white street photography from New York City at night.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop',
    price: 600,
    status: 'available',
    color: 'black',
    style: 'realism',
    era: 'contemporary'
  }
];

const Bid = require('./models/Bid');
const Review = require('./models/Review');

const importData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Artwork.deleteMany();
    await Bid.deleteMany();
    await Review.deleteMany();
    
    // Create / Find Artist
    let artistUser = await User.findOne({ email: 'demo_artist@artgallery.com' });
    if (!artistUser) {
        artistUser = await User.create({
            name: 'Demo Master Artist',
            email: 'demo_artist@artgallery.com',
            password: 'password123',
            role: 'artist',
            mobileNumber: '9999999999',
        });
    }

    // Create / Find Bidder/Buyer
    let collectorUser = await User.findOne({ email: 'collector@example.com' });
    if (!collectorUser) {
        collectorUser = await User.create({
            name: 'Serious Collector',
            email: 'collector@example.com',
            password: 'password123',
            role: 'user',
            mobileNumber: '8888888888',
        });
    }

    // Insert Artworks
    const sampleArtworks = artworks.map((artwork) => {
      return { ...artwork, artist: artistUser._id, isApproved: true };
    });

    const createdArtworks = await Artwork.insertMany(sampleArtworks);

    // Create some sample bids for the auctions
    const auctions = createdArtworks.filter(art => art.status === 'auction');
    
    for (const auction of auctions) {
        // Create 2-3 bids for each auction
        const basePrice = auction.price;
        await Bid.create({
            artwork: auction._id,
            user: collectorUser._id,
            bidAmount: basePrice + 100
        });
        
        await Bid.create({
            artwork: auction._id,
            user: artistUser._id, 
            bidAmount: basePrice + 250
        });

        // Update the artwork with the highest bid
        auction.highestBid = basePrice + 250;
        auction.highestBidder = artistUser._id;
        await auction.save();
    }

    // Create some sample reviews
    const availableArts = createdArtworks.filter(art => art.status === 'available');
    for (let i = 0; i < 3; i++) {
        await Review.create({
            artwork: availableArts[i]._id,
            user: collectorUser._id,
            rating: 5,
            comment: 'Absolutely stunning piece. The colors are even better in person!'
        });
    }

    console.log('Demo Data Imported Successfully!');
    console.log(`Created ${createdArtworks.length} artworks`);
    console.log(`Created bids for ${auctions.length} auctions`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
