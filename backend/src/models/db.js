require("dotenv").config();
const mongoose = require("mongoose");
const { DB_NAME } = require("../../constant.js");

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED", error);
        process.exit(1);
    }
};

// Define Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false }
});

// Create Model
const Todo = mongoose.model("Todo", todoSchema);

// Export both function and model
module.exports = { connectDB, Todo };
