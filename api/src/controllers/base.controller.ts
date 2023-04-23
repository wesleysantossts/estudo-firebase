import { Router } from 'express';

class BaseController {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }
}

export default BaseController;