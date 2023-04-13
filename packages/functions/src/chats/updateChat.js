import { updateChat, getChats } from "@week11/core/database";

export async function main(event) {
  const { chatId } = event.pathParameters;
  const body = JSON.parse(event.body);

  await updateChat(body.newName, chatId, body.sub);

  const newChats = await getChats();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Updated chat", chats: newChats }),
  };
}
