import express from 'express';
import { IRequest } from '../utils/request';

export async function isAuthenticatedMiddleware(req: IRequest, res: express.Response, next: express.NextFunction) {
  if (req.userId) {
    return next();
  }

  res.status(401);
  res.json({ error: 'User not authenticated' });
}
