const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        if (uri.includes('cluster.mongodb.net') && uri.includes('user:pass')) {
            console.log('Detected placeholder MongoDB URI. Spinning up an in-memory database for testing...');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Auto-seed data
        const seedData = require('../utils/seedData');
        await seedData();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
