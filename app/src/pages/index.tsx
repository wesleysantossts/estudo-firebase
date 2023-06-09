import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import APIAdapter from 'services/api/api.services';

const Home: React.FC = () => {
  const API = new APIAdapter();
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState<object[]>([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [uid, setUid] = useState('');
  const [user, setUser] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    (async function loadPosts() {
      const response = await API.getAllPostsOnsnapshot();
      
      if (!response) return;
      
      setPosts(response.lista);
    })();
  }, [])

  const addPost = async () => {
    if (!titulo || !autor) return alert("Preencha os campos titulo e autor");

    const response = await API.addPost(titulo, autor);

    if (!response.success) return alert('Erro ao criar o post');

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
    const response = await API.getAllPosts();

    if (!response.success) return alert("Erro ao listar todos os posts");

    setPosts(response.posts);
  }
  
  const updatePost = async () => {
    if (!idPost) return alert("Insira um id para atualizar");

    const payload = {
      idPost,
      titulo,
      autor
    };
    const response = await API.updatePost(payload);

    if (!response.success) return alert("Erro ao tentar atualizar o post");
  }

  const excluirPost = async (id: any) => {
    const payload = { id: id };
    const response: any = await API.deletePost(payload);

    if (!response || !response.success) return alert("Erro ao tentar deletar o post");

    alert("Post deletado com sucesso!");
  }

  const cadastrarUsuario = async () => {
    if (!email || !senha) return alert("Insira um email e uma senha");
    
    const response = await API.cadastrarUsuario({ email, senha });

    if (response && response.message) return alert(response.message);

    const { uid } = response;
    setUid(uid);

    setEmail('');
    setSenha('');
    alert("Usuário cadastrado com sucesso!")
  }

  const logarUsuario = async () => {
    if (!email || !senha) return alert('Insira um email e uma senha');

    const response = await API.login({ email, senha });

    if (!response) return alert('Não existe usuários com esses dados');

    setUser(response);
    alert('Usuário logado com sucesso!')
  }

  const deslogarUsuario = async () => {
    await API.logout();

    setUser('');
    alert('Usuário deslogado com sucesso!')
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
        <button onClick={() => logarUsuario()}>Login</button>
        <button onClick={() => deslogarUsuario()}>Logout</button>
        <br /><br />
      </div>
      <div>
        <p>UID: {user.uid}</p>
        <p>Email: {user.email}</p>
      </div><br />
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