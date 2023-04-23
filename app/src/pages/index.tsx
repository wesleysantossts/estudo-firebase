import React, { useState, useEffect } from 'react';
import { Container } from './styles';
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
import {
  createUserWithEmailAndPassword
} from 'firebase/auth';
import APIAdapter from 'services/api/api.services';

const Home: React.FC = () => {
  const API = new APIAdapter();
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState<object[]>([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    (function loadPosts() {
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

        setPosts(lista);
      })
    })();
  }, [])

  const addPost = async () => {
    if (!titulo || !autor) return alert("Preencha os campos titulo e autor");

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
    .catch(err => alert('Erro ao criar o post'));

    setTitulo('');
    setAutor('');

    alert('Post criado com sucesso');
  }

  const getPost = async () => {
    if (!idPost) return alert("Insira um ID");

    const response = await API.getPost(idPost);
    if (!response) return alert("Erro ao buscar o post");
    
    setTitulo(response.titulo);
    setAutor(response.autor);
  }

  const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    // getDocs(collection) - pegar todos os documentos de uma coleção
    const postsDocs = await getDocs(postsRef)
    
    // retorna uma array com os docs existentes, se tiver docs 
    if (postsDocs && postsDocs.length === 0) return alert("Não existem posts cadastrados")
    
    const lista: object[] = [];

    postsDocs.forEach(item => {
      const { titulo: tituloPost, autor: autorPost } = item.data();
      
      // id - ele é pego direto do item, não do ".data()"
      lista.push({
        id: item.id,
        titulo: tituloPost,
        autor: autorPost
      });
    })

    setPosts(lista);
  }
  
  const updatePost = async () => {
    const refPost = doc(db, "posts", idPost);

    await updateDoc(refPost, {
      titulo,
      autor
    })
    .catch(error => alert("Erro ao atualizar o post"));
  }

  const excluirPost = async (id: any) => {
    const postRef = doc(db, "posts", id);

    await deleteDoc(postRef)
      .catch(error => alert("Erro ao deletar o post"));

    alert("Post deletado com sucesso!");
  }

  const cadastrarUsuario = async () => {
    if (!email || !senha) return alert("Insira um email e uma senha");
    
    // createUserWithEmailAndPassword(configsAuth, email, senha) - usado para criar a autenticação do firebase
    const response: any = await createUserWithEmailAndPassword(auth, email, senha)
    .catch(error => {
      if (error.code === "auth/weak-password") return alert("Senha muito fraca");
      if (error.code === "auth/email-already-in-use") return alert("Email já existe");
      return alert("Erro ao cadastrar o usuário")
    })

    if (!response || !response.user) return;

    const { user: { uid } } = response;

    setEmail('');
    setSenha('');
    alert("Usuário cadastrado com sucesso!")
  }

  return (
    <Container>
      <h1>React + Firebase</h1>
      <div className="form user">
        <h2>Usuário</h2>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="senha">Senha</label>
        <input type="text" name="senha" id="senha"  value={senha} onChange={e => setSenha(e.target.value)} />
        <button onClick={() => cadastrarUsuario()}>Cadastrar</button>
        <br /><br />
      </div>
      <div className="form">
        <hr /><br />
        <h2>Posts</h2>
        <label htmlFor="id">ID do Post</label>
        <input id="id" type="text" maxLength={160} value={idPost} onChange={e => setIdPost(e.target.value)} /><br />
        <label htmlFor="titulo">Titulo</label>
        <input id="titulo" type="text" maxLength={160} value={titulo} onChange={e => setTitulo(e.target.value)} />
        <label htmlFor="autor">Autor</label>
        <input id="autor" type="text" value={autor} onChange={e => setAutor(e.target.value)} />
        <button onClick={addPost}>Criar</button>
        <button onClick={getPost}>Buscar Post</button>
        <button onClick={getAllPosts}>Buscar Posts</button><br /><br />
        <button onClick={updatePost}>Atualizar Post</button>
        <br />
      </div>
      <div className="posts">
        <ul>
          {posts && posts.map((item: any, index) => {
            return(
              <li key={index}>
                <span><strong>ID do post</strong>: {item.id}</span> 
                <span><strong>Titulo</strong>: {item.titulo}</span> 
                <span><strong>Autor</strong>: {item.autor}</span>
                <button onClick={() => excluirPost(item.id)}>Excluir</button>
              </li>
            )
          })}
        </ul>
      </div>  
    </Container>
  )
}

export default Home;