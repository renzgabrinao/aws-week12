import { createMessage, getMessages } from "@week11/core/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const username = event.requestContext.authorizer?.jwt.claims.username;
  const body = JSON.parse(event.body);

  await createMessage(body.chatId, body.content, sub, username);

  const messages = await getMessages(body.chatId);
  return {
    statusCode: 201,
    body: JSON.stringify({ message: "ok", messages: messages }),
  };
}
