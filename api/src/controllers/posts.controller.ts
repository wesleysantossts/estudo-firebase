import BaseController from './base.controller';
import { Request, Response, NextFunction } from 'express';
import { db, auth } from '../config/db';
import { 
  doc, 
  collection, 
  setDoc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
} from 'firebase/firestore';

class PostsController extends BaseController {
  constructor() {
    super();
  }

  async routes() {
    this.router.get('/post', this.getPost);
    this.router.post('/post', this.addPost);
  }

  async getPost(req: Request, res: Response): Promise<any> {
    const { idPost } = req.query as any;

     if (!idPost) return res.status(500).json({ success: false, message: "Insira um id para o post" });

    // Criar sempre uma referência pois torna o código menos verboso
    const postRef = doc(db, "posts", idPost);
    
    // Buscar um documento no banco a partir de uma referência 
    const post: any = await getDoc(postRef);

    // retorna um ".data()" com os campos do documento
    if (!post.data()) return res.status(404).json({ success: false, message: "Post não encontrado" });

    const { titulo, autor } = post.data();

    return res.json({ titulo, autor });
  }

  async addPost(req: Request, res: Response) {
    const { titulo, autor } = req.body;

    if (!titulo || !autor) return res.status(300).json({ success: false, message: "Insira o titulo e o autor" });

    // Cria com o id que eu definir. Se já houver o id, ele atualizará os dados
    // - doc(configsDb, collection, docId) - cria uma referência do documento
    // await setDoc(doc(db, "posts", "123456"), {
    //   titulo: titulo,
    //   autor: autor
    // });

    // Cria com o id aleatório (ideal para criação de dados)
    // - collection(configDb, collection) - cria uma referencia da coleção que quero add o documento
    await addDoc(collection(db, "posts"), {
      titulo,
      autor
    })
    .catch(err => {
      return res.status(500).json({ success: false, message: err.message })
    });

    return res.json({ success: true });
  }
}

export default PostsController;