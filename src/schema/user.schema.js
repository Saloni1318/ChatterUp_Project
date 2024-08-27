import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String
})

export const userModel = mongoose.model('User', userSchema)