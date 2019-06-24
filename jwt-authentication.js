import njwt from 'njwt';

export const users = [{
  id: '1',
  email: 'first.user@gmail.com',
  password: 'password', // please note that it's NEVER a good idea to store passwords directly nor have passwords `password`
}, {
  id: '2',
  email: 'second.user@gmail.com',
  password: 'password',
}];

const { APP_SECRET = 'something really random', APP_BASE_URL = 'http://localhost:3000' } = process.env;

export function encodeToken(tokenData) {
  return njwt.create(tokenData, APP_SECRET).compact();
}

export function decodeToken(token) {
  return njwt.verify(token, APP_SECRET).body;
}

// this express middleware attaches `userId` to `req` object of authenticated user if authentication was successful
// JWT token is expected to be stored in `Access-Token` header key
export const jwtAuthenticationMiddleware = (req, res, next) => {
  const token = req.header('Access-Token');
  if (!token) {
    return next();
  }

  try {
    const decoded = decodeToken(token);
    const { userId } = decoded;
    if (users.find(user => user.id === userId)) {
      req.userId = userId;
    }
  } catch (e) {
    return next();
  }

  next();
};

// this express middleware stops the request if a user is not authenticated properly
export async function isAuthenticatedMiddleware(req, res, next) {
  if (req.userId) {
    return next();
  }

  res.status(401);
  res.json({ error: 'User not authenticated' });
}

// this endpoints generates and returns JWT access token
export async function jwtLogin(req, res) {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) {
    res.status(401);
    return res.json({ error: 'Invalid email or password' });
  }

  const accessToken = encodeToken({ userId: user.id });

  return res.json({ accessToken });
}
