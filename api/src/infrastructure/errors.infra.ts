import { Response } from "express";

export class ErrorHandle extends Error {
  status: number;
  message: string;
  value?: any;
  constructor(status: number, message: string, value?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.value = value;
  }
}

export class CatchErrorHandle {
  constructor(message: string) {
    return {
      success: false,
      message
    }
  } 
}

export class ValidationErrorHandle extends Error {
  statusCode: number;
  status: string;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}