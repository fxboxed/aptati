/**
 * =========================================================================
 * DATABASE CONNECTION SERVICE (config/db.js) — ES MODULE VERSION
 * =========================================================================
 */

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aptati';
        const connectionInstance = await mongoose.connect(dbURI);

        console.log(`=======================================================`);
        console.log(` SUCCESS: Connected to MongoDB database successfully!`);
        console.log(` Host Database Node: ${connectionInstance.connection.host}`);
        console.log(`=======================================================`);
    } catch (error) {
        console.error(`=======================================================`);
        console.error(` ERROR: Failed to connect to MongoDB database!`);
        console.error(` Details: ${error.message}`);
        console.error(`=======================================================`);
        process.exit(1);
    }
};

export default connectDB;