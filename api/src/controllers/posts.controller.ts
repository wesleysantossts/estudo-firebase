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
    this.router.get('/post', this.getPost)
  }

  async getPost(req: Request, res: Response): Promise<any> {
    const { idPost } = req.query as any;

     if (!idPost) return res.status(500).json({ error: true, message: "Insira um id para o post" });

    // Criar sempre uma referência pois torna o código menos verboso
    const postRef = doc(db, "posts", idPost);
    
    // Buscar um documento no banco a partir de uma referência 
    const post: any = await getDoc(postRef);

    // retorna um ".data()" com os campos do documento
    if (!post.data()) return alert("Erro ao buscar o post");

    const { titulo, autor } = post.data();

    return res.json({ titulo, autor });
  }
}

export default PostsController;