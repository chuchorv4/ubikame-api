import express from 'express'
import http from "http";
import { connect } from 'mongoose'
import { Server } from 'socket.io'
import path from 'path'
import Middleware from './middleware'
import routes from './routes'

if (!process.env.PORT) process.exit(1)

const PORT: number = parseInt(process.env.PORT as string, 10)
const app = express()
const m = new Middleware()

connect(`mongodb://${ process.env.HOSTNAME_APP }:${ process.env.DB_PORT }/${ process.env.DATABASE }`)
  .then(() => console.log('\nConnected to MongoDB...'))
  .catch(err => {
    console.error('\nCould not connect to MongoDB...' + err)
    process.exit(1)
  })
  
app.use('/v1/images', express.static(path.join(__dirname,'/public/images')))
app.use('/v1', [... m.middlewares, routes, m.onNotFound ,m.showError])
app.use('/',[... m.middlewares, m.onNotFound ,m.showError])

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "https://mujer-segura.ucuyucatan.gob.mx",
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