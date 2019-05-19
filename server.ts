import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'env-var';

import * as userController from './controllers/user.controller';
import * as jwtAuthController from './controllers/jwt-auth.controller';

import { jwtAuthenticationMiddleware } from './auth-middlewares/jwt-authentication-middleware';
import { isAuthenticatedMiddleware } from './auth-middlewares/is-authenticated-middleware';

const app = express();
app.use(bodyParser.json());
app.use(jwtAuthenticationMiddleware);

app.get('/users', isAuthenticatedMiddleware, userController.getAll);
app.post('/users', userController.post);
app.post('/jwt-login', jwtAuthController.jwtLogin);

const port = env.get('PORT', '3000').asIntPositive();
app.listen(port, () => console.log(`Authentication example app listening on port ${port}!`));

app.get('/', (req, res) => {
  res.json({
    endpoints: ['GET /users', 'POST /users'],
  });
});
