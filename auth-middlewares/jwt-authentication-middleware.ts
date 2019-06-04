import express from 'express';
import env from 'env-var';
import jwt from 'jsonwebtoken';

import { IRequest } from '../utils/request';
import { users } from '../db/users.db';

export const APP_SECRET = env.get('APP_SECRET').required(true).asString();

export interface ITokenData {
  userId: number;
}

export function encodeToken(tokenData: ITokenData) {
  return jwt.sign(tokenData, APP_SECRET);
}

export function decodeToken(token: string): ITokenData {
  return jwt.verify(token, APP_SECRET) as any;
}

export const jwtAuthenticationMiddleware = (req: IRequest, res: express.Response, next: express.NextFunction) => {
  const token = req.header('Access-Token');
  if (!token) {
    return next();
  }

  try {
    const { userId } = decodeToken(token);
    if (users.find(user => user.id === userId)) {
      req.userId = userId;
    }
  } catch (e) {
    return next();
  }

  next();
};
