import { Server } from '@infrastructure/server.infra';

class App {
  private readonly server: Server;

  constructor() {
    this.server = new Server();
  }

  initialize() {
    this.server.initialize();
  }
}

export default new App().initialize();