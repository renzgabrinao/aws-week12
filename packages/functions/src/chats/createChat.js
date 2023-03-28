import { createChat, getChats } from "@week11/core/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const username = event.requestContext.authorizer?.jwt.claims.username;
  const body = JSON.parse(event.body);

  await createChat(body.name, sub, username);

  const newChats = await getChats();

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Created new chat", chats: newChats }),
  };
}
