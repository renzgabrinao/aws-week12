import { updateChat, getChats } from "@week11/core/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const { chatId } = event.pathParameters;
  const body = JSON.parse(event.body);

  await updateChat(body.newName, chatId, sub);

  const newChats = await getChats();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated chat", chats: newChats }),
  };
}
