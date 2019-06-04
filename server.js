import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'env-var';
import { ExpressOIDC } from '@okta/oidc-middleware';
import session from 'express-session';

import * as userController from './controllers/user.controller';
import * as messagesController from './controllers/messages.controller';
import {isAuthenticatedMiddleware, jwtAuthenticationMiddleware, jwtLogin} from './jwt-authentication';

const app = express();

const oktaDomain = env.get('OKTA_DOMAIN').required(true).asString();
const clientId = env.get('CLIENT_ID').required(true).asString();
const clientSecret = env.get('CLIENT_SECRET').required(true).asString();
const appBaseUrl = env.get('APP_BASE_URL').required(true).asString();
const APP_SECRET = env.get('APP_SECRET').required(true).asString();

const oidc = new ExpressOIDC({
  issuer: `https://${oktaDomain}/oauth2/default`,
  client_id: clientId,
  client_secret: clientSecret,
  appBaseUrl: appBaseUrl,
  scope: 'openid profile',
  post_logout_redirect_uri: 'http://localhost:3000/logout/callback',
});

app.use(session({
  secret: APP_SECRET,
  resave: true,
  saveUninitialized: false,
}));

app.use(oidc.router);
app.use(bodyParser.json());
app.use(jwtAuthenticationMiddleware);

app.get('/users', oidc.ensureAuthenticated(), userController.getAll);
app.post('/users', userController.post);
app.post('/jwt-login', jwtLogin);
app.get('/test', (req, res) => {
  console.log('req.userContext', req.userContext);
  console.log('req.isAuthenticated()', req.isAuthenticated());
  res.json(req.userContext);
});
app.get('/messages', isAuthenticatedMiddleware, messagesController.getAll);
app.post('/messages', isAuthenticatedMiddleware, messagesController.post);

app.get('/logout', oidc.forceLogoutAndRevoke(), (req, res) => {
});

const port = env.get('PORT', '3000').asIntPositive();
app.listen(port, () => console.log(`Authentication example app listening on port ${port}!`));

app.get('/', (req, res) => {
  res.json({
    endpoints: ['GET /users', 'POST /users'],
  });
});
