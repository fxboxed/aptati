// =========================================================================
// DATABASE CONNECTION SERVICE (config/db.js) — ES MODULE VERSION
// =========================================================================

// Load Mongoose, the library that allows Node.js to talk to MongoDB
import mongoose from 'mongoose';

// Define the function that connects your app to your database
const connectDB = async () => {
    try {
        // Retrieve the database web address from your hidden settings (.env)
        // or fall back to your local computer's MongoDB address
        const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aptati';

        // Connect to MongoDB using Mongoose
        const connectionInstance = await mongoose.connect(dbURI);

        // Print success details to your terminal window
        console.log(`=======================================================`);
        console.log(` SUCCESS: Connected to MongoDB database successfully!`);
        console.log(` Host Database Node: ${connectionInstance.connection.host}`);
        console.log(`=======================================================`);
    } catch (error) {
        // Print error details if the database connection fails
        console.error(`=======================================================`);
        console.error(` ERROR: Failed to connect to MongoDB database!`);
        console.error(` Details: ${error.message}`);
        console.error(`=======================================================`);
        
        // Stop the entire application process if the database cannot connect
        process.exit(1);
    }
};

// Export connectDB as default so other files can run: import connectDB from './config/db.js'
export default connectDB;