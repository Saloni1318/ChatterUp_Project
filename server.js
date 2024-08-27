import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import http from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import { userModel } from './src/schema/user.schema.js'
import { chatModel } from './src/schema/chat.schema.js'

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(__dirname, 'public')));

app.use(cors())

export const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {

    console.log('Connection is established')

    // Handle user starts typing event
    socket.on('typing', () => {
        socket.broadcast.emit('user_typing', socket.username);
    });

    // Handle user stops typing event
    socket.on('stop_typing', () => {
        socket.broadcast.emit('user_stop_typing', socket.username);
    });

    // Handle incoming messages from clients
    socket.on('send_message', (message) => {
        // Broadcast the message to all connected users
        io.emit('receive_message', { username: socket.username, message: message });

        // Save the message to the database
        const newMessage = new chatModel({ username: socket.username, message: message });
        newMessage.save()
            .then(savedMessage => {
                console.log('Message saved:', savedMessage);
            })
            .catch(err => {
                console.error('Error saving message:', err);
            });
    });


    socket.on('disconnect', () => {
        console.log('Connection is disconnected')
        console.log(socket.username)
        

        if (socket.username) {
            userModel.findOneAndDelete({ name: socket.username })
                .then(deletedUser => {
                    if (deletedUser) {
                        userModel.find()
                            .then(users => {
                                io.emit('load_users', users);
                            })
                            .catch(err => {
                                console.error('Error fetching users:', err);
                            });
                    }
                })
                .catch(err => {
                    console.error('Error deleting user:', err);
                });
        }

    })

    // new user joined
    socket.on('new_user_joined', (name) => {

        // Load previous messages from the database
        chatModel.find().sort({ createdAt: 'asc' })
        .then( messages => {
            // Send previous messages to the client
            socket.emit('load_messages', messages);
        })
        .catch(err => {
            console.error('Error fetching messages:', err);
        })

        // broadcast user
        console.log(name)
        socket.username = name;
        const newUser = new userModel({ name });
        newUser.save()
            .then(savedUser => {
                userModel.find()
                    .then(users => {
                        io.emit('load_users', users);
                    })
                    .catch(err => {
                        console.error('Error fetching users:', err);
                    });
            })
            .catch(err => {
                console.error('Error saving user:', err);
            });
    })
})