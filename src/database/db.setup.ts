// import mongoose from 'mongoose';
import mongodb from "mongoose";

// Connect to the MongoDB database
let mongoDatabase;

mongoDatabase = process.env.MONGODB_DATABASE;

mongodb.connect(mongoDatabase);
export default mongodb;