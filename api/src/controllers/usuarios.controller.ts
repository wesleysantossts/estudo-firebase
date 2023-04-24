import BaseController from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { auth } from 'config/db';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ErrorHandle, CatchErrorHandle } from '@infrastructure/errors.infra';

class UsuariosController extends BaseController {
  constructor () {
    super();
  }

  async routes() {
    this.router.post('/usuario/novo', this.cadastrarUsuario)
  }

  async cadastrarUsuario(req: Request, res: Response): Promise<any> {
    const { email, senha } = req.body;

    if (!email || !senha) return res.status(400).json({ success: false, message: "Insira um email e uma senha" });

    // createUserWithEmailAndPassword(configsAuth, email, senha) - usado para criar a autenticação do firebase
    const response: any = await createUserWithEmailAndPassword(auth, email, senha)
    .catch((error: any) => {
      // if (error.code === "auth/weak-password") return res.status(400).json({ success: false, message: "Senha muito fraca" });
      if (error.code === "auth/weak-password") return new CatchErrorHandle("Senha muito fraca");

      // if (error.code === "auth/email-already-in-use") return res.status(400).json({ success: false, message: "Email já existe" });
      if (error.code === "auth/email-already-in-use") return new CatchErrorHandle("Email já existe");
      
      // return res.status(400).json({ success: false, message: "Erro ao cadastrar o usuário" });
      return new CatchErrorHandle("Erro ao cadastrar o usuário");
    })
    
    if (response && response.success === false) {
      return res.status(400).json({ success: false, message: response.message })
    };

    const { user: { uid } } = response;

    return res.json({ success: true, uid });
  }
}

export default UsuariosController;