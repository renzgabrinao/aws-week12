import { createChat, getChats } from "@week11/core/database";

export async function main(event) {
  const body = JSON.parse(event.body);

  await createChat(body.name, body.sub, body.userName);

  const newChats = await getChats();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Created new chat",
      chats: newChats,
    }),
  };
}
