import { newId } from '../utils/new-id';

const messages = [{
  id: 1,
  text: 'hello',
  fromUserId: '00uob30wsDzqNYjrR356',
  toUserId: '00ulo4omsF528SdeU356',
}];

export async function getAll(req, res) {
  const { sub } = req.userContext.userinfo;
  const response = messages.filter(message => message.fromUserId === sub || message.toUserId === sub);
  res.json(response);
}

export async function post(req, res) {
  const { sub } = req.userContext.userinfo;
  const { text, toUserId } = req.body;
  const id = newId(messages);

  const newMessage = {
    id, text, fromUserId: sub, toUserId
  };

  messages.push(newMessage);

  res.json(newMessage);
}
