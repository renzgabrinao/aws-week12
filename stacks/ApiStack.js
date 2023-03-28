import { Api, Cognito } from "sst/constructs";

export function API({ stack }) {
  // Create auth provider
  const auth = new Cognito(stack, "Auth", {
    login: ["email", "username"],
  });

  // Adjust the API
  const api = new Api(stack, "api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
      },
    },
    routes: {
      "GET /chats": {
        function: "packages/functions/src/chats/getChats.main",
        authorizer: "none",
      },
      "POST /chats": "packages/functions/src/chats/createChat.main",
      "DELETE /chats/{chatId}": "packages/functions/src/chats/deleteChat.main",
      "PUT /chats/{chatId}": "packages/functions/src/chats/updateChat.main",

      "GET /messages/{chatId}": {
        function: "packages/functions/src/messages/getMessages.main",
        authorizer: "none",
      },
      "POST /messages": "packages/functions/src/messages/createMessage.main",
      "DELETE /messages/{chatId}/{messageId}":
        "packages/functions/src/messages/deleteMessage.main",
      "PUT /messages/{chatId}/{messageId}":
        "packages/functions/src/messages/updateMessage.main",
    },
  });

  // Allow authenticated users invoke API
  auth.attachPermissionsForAuthUsers(stack, [api]);

  stack.addOutputs({
    ApiEndpoint: api.url,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId ?? "",
    UserPoolClientId: auth.userPoolClientId,
  });

  return { api, auth };
}
