import express from 'express';

import { newId } from '../utils/new-id';
import { users } from '../db/users.db';

export async function post(req: express.Request, res: express.Response) {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    res.status(400);
    return res.json({ error: 'User already exists' });
  }

  if (!email || !password) {
    res.status(400);
    return res.json({ error: 'Email and password is required' });
  }

  const id = newId(users);

  const newUser = { email, password, id };
  users.push(newUser);

  res.json({ id, email });
}

export async function getAll(req: express.Request, res: express.Response) {
  res.json(users);
}
