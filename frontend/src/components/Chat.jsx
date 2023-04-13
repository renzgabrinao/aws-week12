import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth, API } from "aws-amplify";

export default function Chat({
  room,
  getChatMessages,
  setChats,
  setCurrentChat,
}) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [updateChat, setUpdateChat] = useState("");
  const [form, setForm] = useState(false);

  const handleDeleteChat = async (id) => {
    const tokens = await Auth.currentSession();

    // grab sub
    const sub = tokens.accessToken.payload.sub;

    const res = await API.del("api", `/chats/${id}`, {
      body: {
        sub: sub,
      },
    });
    setChats(res.chats);
    setCurrentChat("");
  };

  const handleUpdateChat = async (e) => {
    e.preventDefault();

    const tokens = await Auth.currentSession();

    // grab sub
    const sub = tokens.accessToken.payload.sub;

    const res = await API.put("api", `/chats/${room.id}`, {
      body: {
        newName: updateChat,
        sub: sub,
      },
    });
    setChats(res.chats);
    setUpdateChat("");
    setForm(false);
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1
          className="text-2xl hover:cursor-pointer"
          onClick={() => {
            getChatMessages(room.id);
          }}
        >
          {room.name}
        </h1>
        {room.user_id === user.attributes?.sub ? (
          <div className="text-xl">
            <span
              className="text-green-500 hover:cursor-pointer"
              onClick={() => setForm(!form)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </span>
            <span
              className="text-red-500 ml-3 hover:cursor-pointer"
              onClick={() => {
                handleDeleteChat(room.id);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </span>
          </div>
        ) : (
          <></>
        )}
      </div>

      {form ? (
        <form
          className="flex flex-col mt-1 mb-3"
          onSubmit={(e) => handleUpdateChat(e, room.id)}
        >
          <input
            className="text-black p-1 mb-1"
            type="text"
            onChange={(e) => {
              setUpdateChat(e.target.value);
            }}
            value={updateChat}
          />
          <button
            className="border-2 border-black bg-green-800 text-white hover:bg-green-500 hover:text-black transition-all rounded-xl py-1 px-2"
            type="submit"
          >
            Enter
          </button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
}
