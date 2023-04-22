import express, { Express, Router } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

export class Server {
  private readonly server: Express;
  constructor() {
    this.server = express();
    this.initialize();
  }

  initialize() {
    this.middlewares();
    this.listen();
  }

  middlewares(): void {
    this.server.use('/api', cors(), express.json(), express.urlencoded({ extended: true }));
    this.server.use('/storage', express.static(path.join(__dirname, '..', 'storage')));
  }

  controllers() {}
  
  listen(): void {
    this.server.listen(PORT);
  }
}