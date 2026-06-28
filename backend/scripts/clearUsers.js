import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

dotenv.config();

const clear = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not set. Run this from the backend folder so .env is loaded.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");

    const users = await User.deleteMany({});
    const conversations = await Conversation.deleteMany({});
    const messages = await Message.deleteMany({});

    console.log(`Deleted ${users.deletedCount} user(s)`);
    console.log(`Deleted ${conversations.deletedCount} conversation(s)`);
    console.log(`Deleted ${messages.deletedCount} message(s)`);

    await mongoose.disconnect();
    console.log("Done. You can now register fresh users.");
    process.exit(0);
};

clear().catch((error) => {
    console.error(error);
    process.exit(1);
});
