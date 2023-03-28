import { useAuthenticator } from "@aws-amplify/ui-react";
import { Auth, API } from "aws-amplify";
import { useState } from "react";

export default function Message({ msg, currentChat, setMessages }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const [updateMessage, setUpdateMessage] = useState("");
  const [form, setForm] = useState(false);

  const handleDeleteMessage = async (id) => {
    await API.del("api", `/messages/${currentChat}/${id}`, {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    }).then((res) => setMessages(res.messages));
  };

  const handleUpdateMessage = async (e) => {
    e.preventDefault();

    await API.put("api", `/messages/${currentChat}/${msg.id}`, {
      body: {
        content: updateMessage,
      },
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    }).then((res) => setMessages(res.messages));

    setUpdateMessage("");
    setForm(false);
  };

  return (
    <div
      className={
        user.attributes?.sub === msg.user_id
          ? "text-right flex flex-col justify-end items-end"
          : "text-left"
      }
    >
      {/* text-3xl border-2 border-transparent px-3 py-2 rounded-lg bg-stone-500 */}
      <div className="w-[40%]">
        <p className="text-sm">{msg.username}</p>
        <p
          className={
            msg.user_id === user.attributes?.sub
              ? "text-3xl border-2 border-transparent px-3 py-2 mb-3 rounded-lg bg-blue-800"
              : "text-3xl border-2 border-transparent px-3 py-2 rounded-lg bg-stone-500"
          }
        >
          {msg.content}
        </p>
        {msg.user_id === user.attributes?.sub ? (
          <>
            <span
              className="text-green-500 text-xl mr-3 hover:cursor-pointer"
              onClick={() => setForm(!form)}
            >
              <i className="fa-regular fa-pen-to-square"></i>
            </span>
            <span
              className="text-red-500 text-xl hover:cursor-pointer"
              onClick={() => {
                handleDeleteMessage(msg.id);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </span>
          </>
        ) : (
          <></>
        )}
      </div>
      {form ? (
        <form
          className="flex flex-col mt-1 mb-3"
          onSubmit={(e) => handleUpdateMessage(e, msg.id)}
        >
          <input
            className="text-black p-1 mb-1"
            type="text"
            onChange={(e) => {
              setUpdateMessage(e.target.value);
            }}
            value={updateMessage}
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
