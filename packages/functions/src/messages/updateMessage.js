import { updateMessage, getMessages } from "@week11/core/database";

export async function main(event) {
  const { chatId, messageId } = event.pathParameters;
  const body = JSON.parse(event.body);

  await updateMessage(body.content, body.type, messageId, body.sub);

  const messages = await getMessages(chatId);
  return {
    statusCode: 200,
    body: JSON.stringify({ messages: messages }),
  };
}
