import express from 'express';

import { users } from '../db/users.db';
import { encodeToken } from '../auth-middlewares/jwt-authentication-middleware';

export async function jwtLogin(req: express.Request, res: express.Response) {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    res.status(401);
    return res.json({ error: 'Invalid email or password' });
  }

  const accessToken = encodeToken({ userId: user.id });

  return res.json({ accessToken });
}
