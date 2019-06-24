import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { ExpressOIDC } from '@okta/oidc-middleware';
import session from 'express-session';

import * as messagesController from './messages.controller';
import { isAuthenticatedMiddleware, JWTAuthenticationMiddleware, JWTLogin } from './JWT-authentication';

const app = express();

const { OKTA_DOMAIN, CLIENT_ID, CLIENT_SECRET, APP_BASE_URL, APP_SECRET } = process.env;

const oidc = new ExpressOIDC({
  issuer: `https://${OKTA_DOMAIN}/oauth2/default`,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  appBaseUrl: APP_BASE_URL,
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
app.use(JWTAuthenticationMiddleware);

app.post('/JWT-login', JWTLogin);

app.get('/messages', oidc.ensureAuthenticated(), messagesController.getAll);
app.post('/messages', oidc.ensureAuthenticated(), messagesController.post);

// or attach endpoints like this to use your custom-made JWT middleware instead
// app.get('/messages', isAuthenticatedMiddleware, messagesController.getAll);
// app.post('/messages', isAuthenticatedMiddleware, messagesController.post);

app.get('/logout', oidc.forceLogoutAndRevoke(), (req, res) => {
  // this is never called because forceLogoutAndRevoke always redirects
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`Authentication example app listening on port ${PORT}!`));
