import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import route from './routes/LogRoute.js';
import handleErrors from './middleware/errorMiddleware.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
// app.use(handleErrors()); 

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;
const server = http.createServer(app);
const io = new Server(server);

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected successfully');

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

app.use('/api', route);
