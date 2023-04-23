import express, { Router } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

class Server {
  private readonly server: express.Application;
  private readonly basePathApi = '/api';
  private readonly basePathStorage = '/storage';
  private readonly basePathControllers = '/controllers';
  constructor() {
    this.server = express();
  }

  initialize() {
    this.middlewares();
    this.controllers();
    this.listen();
  }

  middlewares(): void {
    this.server.use(cors(), express.json(), express.urlencoded({ extended: true }));
    this.server.use(this.basePathStorage, express.static(path.join(__dirname, '..', this.basePathStorage)));
  }

  private async controllers() {
    const router: Router[] = [];
    const controllersPath = path.join(__dirname, '..', this.basePathControllers);
    const files = fs.readdirSync(controllersPath);
    if (files.length > 0) {
      for (const file of files) {
        const controller = await import(path.join(controllersPath, file));
        const initializedController = new controller.default();
        if (initializedController.routes) {
          initializedController.routes();
          router.push(initializedController.router);
        }
      }

      this.server.use(this.basePathApi, router);
    }
  }
  
  listen() {
    this.server.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT}`));
  }
}

export default Server;