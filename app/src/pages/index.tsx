import React, { useState } from 'react';
import { Container } from './styles';
import { db } from '../config/db';
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore';

const Home: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState<object[]>([]);

  const addPost = async () => {
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
    // Criar sempre uma referência pois torna o código menos verboso
    const postRef = doc(db, "posts", "HIDiSVgsTVGODKXwoTG5");
    
    // Buscar um documento no banco a partir de uma referência 
    const post: any = await getDoc(postRef);

    // retorna um ".data()" com os campos do documento
    if (!post.data()) return alert("Erro ao buscar o post");

    const { titulo: tituloPost, autor: autorPost } = post.data();
    
    setTitulo(tituloPost);
    setAutor(autorPost);
  }

  const getAllPosts = async () => {
    const postsRef = collection(db, "posts");
    // getDocs(collection) - pegar todos os documentos de uma coleção
    const postsDocs = await getDocs(postsRef)
    
    // retorna uma array com os docs existentes, se tiver docs 
    if (postsDocs && postsDocs.length === 0) return alert("Não existem posts cadastrados")
    
    const lista: object[] = [];

    postsDocs.forEach(item => {
      const { id, titulo: tituloPost, autor: autorPost } = item.data();
    
      lista.push({
        id,
        titulo: tituloPost,
        autor: autorPost
      });
    })

    setPosts(lista);
  }

  return (
    <Container>
      <h1>React + Firebase</h1>
      <div className="form">
        <label htmlFor="titulo">Titulo</label>
        <input id="titulo" type="text" maxLength={160} value={titulo} onChange={e => setTitulo(e.target.value)} />
        <label htmlFor="autor">Autor</label>
        <input id="autor" type="text" value={autor} onChange={e => setAutor(e.target.value)} />
        <button onClick={addPost}>Criar</button>
        <button onClick={getPost}>Buscar Post</button>
        <button onClick={getAllPosts}>Buscar Posts</button>
        <br /><hr />
      </div>
      <div className="posts">
        <h2>Posts</h2>
        <ul>
          {posts && posts.map((item, index) => {
            return(
              <li key={index}>
                <span><strong>Titulo</strong>: {item.titulo}</span><br/> 
                <span><strong>Autor</strong>: {item.autor}</span>
              </li>
            )
          })}
        </ul>
      </div>  
    </Container>
  )
}

export default Home;