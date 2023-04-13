import { deleteChat, getChats } from "@week11/core/database";

export async function main(event) {
  const body = JSON.parse(event.body);

  const { chatId } = event.pathParameters;
  await deleteChat(chatId, body.sub);

  const newChats = await getChats();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Deleted chat", chats: newChats }),
  };
}
