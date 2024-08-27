import mongoose from 'mongoose'

const url = process.env.MONGODB

export const connect = async() => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true
        })
        console.log("MongoDB connected using mongoose")
    } catch (error) {
        console.log('Error: ' + error)
    }
    
}