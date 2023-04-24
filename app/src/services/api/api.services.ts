import React from 'react'
import axios, { AxiosInstance, AxiosError } from 'axios'

interface IAPI {
  client: AxiosInstance
}

export default class APIAdapter implements IAPI {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URL_API
    });
  }

  // Posts
  async getPost(idPost: any): Promise<any> {
    const payload = new URLSearchParams({
      idPost
    });
    const { data } = await this.client.get(`/post?${payload}`);
    return data;
  }

  async addPost(titulo: any, autor: any): Promise<any> {
    const payload = {
      titulo,
      autor
    };
    const { data } = await this.client.post('/post', payload)
    return data;
  }

  async getAllPosts() {
    const { data } = await this.client.get('/posts');

    return data;
  }

  async getAllPostsOnsnapshot() {
    const response = await this.client.get('/posts/onsnapshot');

    if (!response) return;

    return response.data;
  }

  async updatePost(payload: object) {
    const { data } = await this.client.put('/post', payload);

    return data;
  }

  async deletePost(payload: object | any) {
    const { data } = await this.client.delete(`/post/${payload.id}`);

    return data;
  }

  // Usuários
  async cadastrarUsuario(payload: object) {
    const response: any = await this.client.post('/usuario/novo', payload)
    .catch(error => {
      console.log('Erro ao cadastrar o usuario', error)
      return error.response.data;
    });

    if (!response.data && response.message) return response;

    return response.data;
  }
}
