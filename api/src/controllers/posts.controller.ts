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
    this.router.get('/posts', this.getAllPosts);
    this.router.get('/posts/onsnapshot', this.getAllPostsOnsnapshot);
    this.router.put('/post', this.updatePost);
    this.router.post('/post', this.addPost);
    this.router.delete('/post/:id', this.deletePost);
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

  async getAllPosts(req: Request, res: Response) {
    const postsRef = collection(db, "posts");

    // getDocs(collection) - pegar todos os documentos de uma coleção
    const postsDocs: any = await getDocs(postsRef)
    
    // retorna uma array com os docs existentes, se tiver docs 
    if (postsDocs && postsDocs.length === 0) return res.status(404).json({ success: false, message: "Não existem posts cadastrados" });
    
    const lista: object[] = [];

    postsDocs.forEach((item: any) => {
      const { titulo: tituloPost, autor: autorPost } = item.data();
      
      // id - ele é pego direto do item, não do ".data()"
      lista.push({
        id: item.id,
        titulo: tituloPost,
        autor: autorPost
      });
    })

    return res.json({ success: true, amount: lista.length, posts: lista })
  }

  async getAllPostsOnsnapshot(req: Request, res: Response) {
    const postsRef = collection(db, "posts");
    
    
    // onSnapshot(collection, callback) - usado para bater no banco toda hora pra saber se teve alguma atualização (real time). Deve-se usar com cautela, não usando em toda a aplicação (só em lugares necessários mesmo) pra não pesar a aplicação e gastar requisição mais do que o necessário.
    // - é um método síncrono
    onSnapshot(postsRef, (snapshot) => {
      let lista: object[] = [];
      
      snapshot.forEach(item => {
        const { titulo: tituloPost, autor: autorPost } = item.data();
        
        // id - ele é pego direto do item, não do ".data()"
        lista.push({
          id: item.id,
          titulo: tituloPost,
          autor: autorPost
        });
      })
      
      return res.json({ success: true, lista });
    })
    
  }

  async updatePost(req: Request, res: Response) {
    const { idPost, titulo, autor } = req.body;

    if (!idPost) return res.status(300).json({ success: false, message: "Insira um id para o post" });
    
    const refPost = doc(db, "posts", idPost);

    await updateDoc(refPost, {
      titulo,
      autor
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: "Erro ao atualizar o post" });
    });

    return res.json({ success: true });
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

  async deletePost(req: Request, res: Response) {
    const { id } = req.params;

    const postRef = doc(db, "posts", id);

    await deleteDoc(postRef)
    .catch(error => {
      return res.status(500).json({ success: false, error: error.message, message: "Erro ao deletar o post" })
    });

    return res.json({ success: true });
  }
}

export default PostsController;