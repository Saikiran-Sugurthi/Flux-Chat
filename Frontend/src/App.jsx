import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const messagesEndRef = useRef(null);

  // restore session on refresh
  useEffect(() => {
    const savedUser = sessionStorage.getItem("username");
    const savedRoom = sessionStorage.getItem("roomId");

    if (savedUser && savedRoom) {
      setUsername(savedUser);
      setRoomId(savedRoom);
      setJoined(true);

      socket.emit("join-room", {
        roomId: savedRoom,
        username: savedUser,
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const joinRoom = () => {
    if (!username || !roomId) return;

    socket.emit("join-room", { roomId, username });

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("roomId", roomId);

    setJoined(true);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", { roomId, message, username });
    setMessage("");
    socket.emit("stop-typing", roomId);
  };

  // socket listeners
  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user-joined", (name) => {
      setMessages((prev) => [
        ...prev,
        { username: "System", message: `${name} joined the room` },
      ]);
    });

    socket.on("typing", (name) => {
      setTypingUser(name);
    });

    socket.on("stop-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  /* JOIN SCREEN */
  if (!joined) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white w-[360px] p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-violet-600 mb-6">
            Flux
          </h2>

          <input
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Your name"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Room ID"
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={joinRoom}
            className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  //Chat Screen
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white w-[420px] h-[85vh] rounded-xl shadow-lg flex flex-col">

        {/* Header */}
        <div className="px-5 py-3 border-b font-semibold text-slate-700">
          Room: <span className="text-violet-600">{roomId}</span>
        </div>

        {/* Msgs */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3">
          {messages.map((msg, i) => {
            const isUser = msg.username === username;
            const isSystem = msg.username === "System";

            return (
              <div
                key={i}
                className={`animate-fade-in max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                  isSystem
                    ? "bg-emerald-100 text-emerald-800 mx-auto text-center"
                    : isUser
                    ? "bg-violet-600 text-white ml-auto"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                {!isSystem && (
                  <p className="text-xs font-semibold opacity-70 mb-1">
                    {msg.username}
                  </p>
                )}
                <p>{msg.message}</p>
                <p className="text-[10px] mt-1 opacity-50 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing */}
        {typingUser && (
          <div className="px-4 pb-1 text-xs text-slate-400">
            {typingUser} is typing...
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t flex gap-2">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing", { roomId, username });
            }}
            onBlur={() => socket.emit("stop-typing", roomId)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-violet-400 outline-none"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-violet-600 text-white px-4 rounded-lg hover:bg-violet-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
