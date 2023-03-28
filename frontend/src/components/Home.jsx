import { Auth, API } from "aws-amplify";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";

import Message from "./Message";
import Chat from "./Chat";

export default function Home() {
  // AUTH STUFF
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const publicRequest = async () => {
    const response = await API.get("api", "/chats");
    alert(JSON.stringify(response));
  };

  const privateRequest = async () => {
    try {
      const response = await API.get(
        "api",
        "/messages/5afec214-6bbc-47fe-9b0a-dcc18f88bbec",
        {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getAccessToken()
              .getJwtToken()}`,
          },
        }
      );
      alert(JSON.stringify(response));
    } catch (error) {
      alert(error);
    }
  };

  // CHATS N MESSAGES STUFF
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const [currentChat, setCurrentChat] = useState("");

  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    console.log(apiUrl);
    const getChatRooms = async () => {
      await API.get("api", "/chats").then((res) => setChats(res.chats));
    };
    getChatRooms();
    console.log(user.attributes?.sub);
  }, []);

  const getChatMessages = (id) => {
    setCurrentChat(id);

    axios
      .get(apiUrl + "/messages/" + id)
      .then((res) => setMessages(res.data.messages));
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (!!!newChat) {
      setErrorMsg("You need to enter a name");
      return;
    }
    await API.post("api", "/chats", {
      body: {
        name: newChat,
      },
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    }).then((res) => setChats(res.chats));

    setErrorMsg(null);
    setNewChat("");
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();

    await API.post("api", "/messages", {
      body: {
        chatId: currentChat,
        content: newMessage,
      },
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    }).then((res) => setMessages(res.messages));

    setNewMessage("");
  };

  const handleExitRoom = () => {
    setCurrentChat("");
    setMessages([]);
  };

  return (
    <div className="text-white">
      <header className="h-[75px] flex flex-row justify-between px-6 py-3 items-center">
        <div>
          <p>
            {user?.username} || {user?.attributes.email}
          </p>
        </div>
        <div className="w-[400px] flex flex-row justify-between">
          <button
            className="border-2 border-black bg-green-800 hover:bg-green-500 hover:text-black transition-all rounded-lg py-1 px-2"
            onClick={publicRequest}
          >
            Public Request
          </button>
          <button
            className="border-2 border-black bg-green-800 hover:bg-green-500 hover:text-black transition-all rounded-lg py-1 px-2"
            onClick={privateRequest}
          >
            Private Request
          </button>
          <button
            className="border-2 border-black bg-red-800 hover:bg-red-500 hover:text-black transition-all rounded-lg py-1 px-2"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="min-h-screen flex flex-row p-4 font-mono">
        <div className="w-[20%]">
          <form
            className="flex flex-col justify-evenly text-xl text-center mb-7 h-32"
            onSubmit={handleCreateChat}
          >
            <input
              className="text-black p-1"
              type="text"
              onChange={(e) => {
                setNewChat(e.target.value);
              }}
              value={newChat}
            />
            <button
              className="border-2 border-black bg-green-800 text-white hover:bg-green-500 hover:text-black transition-all rounded-xl py-1 px-2"
              type="submit"
            >
              create new room
            </button>
            {!!errorMsg ? <h2 className="text-red-500">{errorMsg}</h2> : <></>}
          </form>

          <div>
            <h1 className="text-3xl font-bold">rooms</h1>
            <div className="my-2">
              <hr />
            </div>
            {!!chats &&
              chats.map((room) => (
                <div key={room.id}>
                  <Chat
                    room={room}
                    getChatMessages={getChatMessages}
                    setChats={setChats}
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="w-[80%]">
          <div className="h-[900px] overflow-scroll p-5">
            {!!currentChat ? (
              <>
                <button
                  className="px-6 py-1 mb-5 rounded-xl border-2 border-black bg-red-800 hover:bg-red-500 hover:text-black transition-all "
                  onClick={() => {
                    handleExitRoom();
                  }}
                >
                  Exit Room
                </button>
              </>
            ) : (
              <></>
            )}
            {!!messages &&
              messages.map((msg) => (
                <div key={msg.id}>
                  <Message
                    msg={msg}
                    currentChat={currentChat}
                    setMessages={setMessages}
                  />
                </div>
              ))}
          </div>

          <div className="h-[10%]">
            {currentChat ? (
              <form className="flex flex-row" onSubmit={handleCreateMessage}>
                <input
                  className="text-black text-base px-3 py-1 flex-grow rounded-xl"
                  type="text"
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                  }}
                  value={newMessage}
                />
                <button
                  className="py-2 px-6 ml-6 rounded-xl border-2 border-black bg-green-800 hover:bg-green-500 hover:text-black transition-all"
                  type="submit"
                >
                  Enter
                </button>
              </form>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
