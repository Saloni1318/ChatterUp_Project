import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const chatModel = mongoose.model('Chat', chatSchema)
