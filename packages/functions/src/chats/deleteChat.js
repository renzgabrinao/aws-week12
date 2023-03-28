import { deleteChat, getChats } from "@week11/core/database";

export async function main(event) {
  const sub = event.requestContext.authorizer?.jwt.claims.sub;
  const { chatId } = event.pathParameters;
  await deleteChat(chatId, sub);
  const newChats = await getChats();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Deleted chat", chats: newChats }),
  };
}
