import React from 'react'
import axios, { AxiosInstance, AxiosError } from 'axios'

interface IAPI {
  client: AxiosInstance
}

export default class APIAdapter implements IAPI {
  public readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_URL_API
    })
  }
}
