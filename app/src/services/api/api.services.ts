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
    const { data } = await this.client.get(`/post?idPost=${idPost}`);
    return data;
  }
}
