import dotenv from 'dotenv'
dotenv.config()

import { connect } from './src/config/db.config.js'
import { server } from './server.js'

server.listen(process.env.PORTNUMBER, ()=> {
    console.log('App is listening on 3000')
    connect()
})