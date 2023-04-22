import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

class Server {
  private readonly server: express.Application;
  constructor() {
    this.server = express();
    this.initialize();
  }

  initialize() {
    this.listen();
  }

  middlewares() {
    this.server.use('/api', cors(), express.json(), express.urlencoded({ extended: true }));
    this.server.use('/storage', express.static(path.join(__dirname, '..', 'storage')));
  }

  controllers() {}
  
  listen() {
    this.server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
  }
}

export default Server;