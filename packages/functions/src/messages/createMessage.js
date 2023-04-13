import { createMessage, getMessages } from "@week11/core/database";

export async function main(event) {
  const body = JSON.parse(event.body);

  await createMessage(
    body.chatId,
    body.content,
    body.type,
    body.sub,
    body.userName
  );

  const messages = await getMessages(body.chatId);
  return {
    statusCode: 201,
    body: JSON.stringify({ message: "ok", messages: messages }),
  };
}
