import express from 'express'
import http from 'http';
import { connect } from 'mongoose'
import { Server } from 'socket.io'
import { initializeApp, cert } from 'firebase-admin/app'
import path from 'path'
import Middleware from './middleware'
import routes from './routes'

if (!process.env.PORT) process.exit(1)

const PORT: number = parseInt(process.env.PORT)
const app = express()
const m = new Middleware()
const serviceAccount = require(`./certs/${ process.env.GOOGLE_CERT }`)

connect(`mongodb://${ process.env.HOSTNAME_APP }:${ process.env.DB_PORT }/${ process.env.DATABASE }`)
  .then(() => console.log('\nConnected to MongoDB...'))
  .catch(err => {
    console.error('\nCould not connect to MongoDB...' + err)
    process.exit(1)
  })
  
app.use('/v1/images', express.static(path.join(__dirname, '/public/images')))
app.use('/v1', [... m.middlewares, routes, m.onNotFound ,m.showError])
app.use('/', [...m.middlewares, m.onNotFound, m.showError])

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    credentials: true
  }
})

io.on("connection", function(socket: any) {
  console.log("a user connected")
  socket.emit('conection','success')
})

app.set('socketio', io)

server.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })


if (module['hot']) {
  module['hot'].accept();
  module['hot'].dispose(() => server.close());
}