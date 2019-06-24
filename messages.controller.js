const messages = [];

function getUserIdFromAuthenticatedRequest(req) {
  if (req.userId) {
    return req.userId;
  }
  return req.userContext && req.userContext && req.userContext.sub;
}

export async function getAll(req, res) {
  const userId = getUserIdFromAuthenticatedRequest(req);
  const response = messages.filter(message => message.fromUserId === userId || message.toUserId === userId);
  res.json(response);
}

export async function post(req, res) {
  const userId = getUserIdFromAuthenticatedRequest(req);
  const { text, toUserId } = req.body;

  const id = messages.length + 1;

  if (!text || !toUserId) {
    res.status(400);
    return res.json({ error: 'Message requires both `text` and `toUserId` fields.' });
  }

  const newMessage = {
    id, text, fromUserId: userId, toUserId
  };

  messages.push(newMessage);

  res.json(newMessage);
}
